var extend = require('extend') 

function fixQuery (searchObj, queryObj){ 
  queryObj.from = searchObj.from 
  queryObj.size = searchObj.size 
  var sort = searchObj.sortBy
  if (sort === 'relevance'){ // use regular ES sorting
    return queryObj 
  }else{
    queryObj.sort = []
    var sortObj = {}
    sortObj[searchObj.sortBy] = searchObj.sortOrd 
    queryObj.sort.push(sortObj)
    console.log(JSON.stringify(queryObj))
    return queryObj
  }
}
//Input  "{ "query": { *sum stuff* } }" 
//Output "{ *sum stuff *}"    
function clearQuery(queryString){ 
  var obj = JSON.parse(queryString)
  var temp = {} 
  extend(temp, obj.query) 
  return temp   
}

exports.searchKeyword = function (searchObj) {
  var queryObj = {}
  queryObj.query = {
    match: {
      keywords: searchObj.searchQuery
    }
  }
  return fixQuery(searchObj, queryObj) 
}

exports.searchDescription = function(searchObj) {
  var queryObj = {}
  //lets consider both reademe and package description, as both are des
  queryObj.query =  {
    multi_match : {
        query : searchObj.searchQuery
      , type  :   "best_fields"  
      , fields : [ "description^3", "readme^2" ] 
    }
  }
  return fixQuery(searchObj, queryObj) 
}

exports.searchPackageName = function(searchObj){ 
  var queryObj = {}
  queryObj.query = { 
    match: {
      'name.untouched':{
      query: searchObj.searchQuery
      , operator: "and"
      }
    }
  }
  return fixQuery(searchObj, queryObj); 
} 

exports.searchAuthor = function(searchObj){ 
  var queryObj = {} 
  queryObj.query = {
    match: {
      author: searchObj.searchQuery
    }  
  }
  return fixQuery(searchObj, queryObj)
}

exports.searchMaintainers = function(searchObj){ 
  var queryObj = {}
  queryObj.query = {
    match: {
      maintainers: searchObj.searchQuery 
      , fuzziness: 2   
    }
  }
  return fixQuery(searchObj, queryObj)
} 

exports.searchDependencies = function(searchObj){ 
  var queryObj = {} 
  queryObj.query = {
    match: {
      dependencies: searchObj.searchQuery 
      , fuzziness: 1 
    }  
  }
  return fixQuery(searchObj, queryObj)
}  

exports.searchDefault = function(searchObj){ 
  var query = {
    "query": {
      "function_score": {
        "query": {
          "dis_max": {
            "tie_breaker": 0.7,
            "boost": 1.2,
            "queries": [
              {
                "match": {
                  "name.untouched": {
                    "query": searchObj.searchQuery,
                    "operator": "and",
                    "boost": 5
                  }
                }
              },
              {
                "bool": {
                  "should": [
                    {
                      "match_phrase": {
                        "keywords": searchObj.searchQuery
                      }
                    },
                    {
                      "match_phrase": {
                        "description": searchObj.searchQuery
                      }
                    },
                    {
                      "match_phrase": {
                        "readme": searchObj.searchQuery
                      }
                    }
                  ],
                  "minimum_should_match": 1
                }
              },
              {
                "multi_match": {
                  "query": searchObj.searchQuery,
                  "fields": [
                    "name^5",
                    "keywords^2",
                    "description^3",
                    "readme"
                  ]
                }
              }
            ]
          }
        },
        "functions": [
          {
            "script_score": {
              "script": "(doc['dlScore'].isEmpty() ? 0 : doc['dlScore'].value) * 1.2"
            }
          },
          {
            "script_score": {
              "script": "(doc['stars'].isEmpty() ? 0 : doc['dlScore'].value) * 1.2"
            }
          },
          {
            "script_score": {
              "script": "if (doc['hasTest'].equals('true')){1.1} else{-1.5}"
            }
          },
          {
            "script_score": {
              "script": "(doc['dependantScore'].isEmpty() ? 0 : doc['dependantScore'].value)"
            }
          }
        ],
        "score_mode": "sum"
      }
    }
  }
  return fixQuery(searchObj, query)
} 

