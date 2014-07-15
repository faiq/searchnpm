function sortQuery (searchObj, queryObj){ 
  var sort = searchObj["sortBy"]
  if (sort === 'relevance'){ // use natural ES sorting
    return JSON.stringify(queryObj) 
  }else{
    queryObj.sort = []
    var sortObj = {}
    sortObj[sort] = "desc" //TODO: include additional sort parameters
    queryObj.sort.push(sortObj)
    console.log(JSON.stringify(queryObj))
    return JSON.stringify(queryObj)
  }
}

exports.searchKeyword = function (searchObj) {
  var queryObj = {}
  queryObj.query = {
    match: {
      keywords: searchObj["searchQuery"]
    }
  }
  return sortQuery(searchObj, queryObj) 
}

exports.searchDescription = function(searchObj) {
  var queryObj = {}
  //lets consider both reademe and package description, as both are des
  queryObj.query =  {
    multi_match : {
        query : searchObj["searchQuery"]
      , type  :   "best_fields"  
      , fields : [ "description^3", "readme" ] 
    }
  }
  return sortQuery(searchObj, queryObj) 
}

exports.searchPacakgeName = function(searchObj){ 
  var queryObj = {}
  queryObj.query = { 
    match: {
      name.untouched:{
      query: searchObj['searchQuery']
      , operator: "and"
      , fuzziness: 1
      }
    }
  }
  return sortQuery(searchObj, queryObj); 
} 

exports.searchAuthor = function(searchObj){ 
  var queryObj = {} 
  queryObj.query = {
    match: {
      author: searchObj['searchQuery']
    }  
  }
  return sortQuery(searchObj, queryObj)
}

exports.searchMaintainers = function(searchObj){ 
  var queryObj = {}
  queryObj.query = {
    match: {
      maintainers: searchObj['searchQuery'] 
      , fuzziness: 2   
    }
  }
  return sortQuery(searchObj, queryObj)
} 

exports.searchDependencies = function(searchObj){ 
  var queryObj = {} 
  queryObj.query = {
    match: {
      dependencies: searchObj['searchQuery'] 
      , fuzziness: 2
    }  
  }
  return sortQuery(searchObj, queryObj)
} 

expots.seachDefault = function(searchObj){ 
  var queryObj = {}
  queryObj.dis_max = {
    tie_breaker : 0.7,
    boost : 1.2,
    queries : []
  }
  //rank by name 
  
  //rank by downloads 

  //check if there is a test script

  //check dependancy score TODO: cron over all packages and apply a function to calculate score of dependency  

  //rank by keywords/description/description 

  //rank by commit date

  //rank by open issues

  //rank by total number of stars GH & npmStarz
   
} 
