//TODO: 
//Input JSON that might look like { search-by: <argument>, search-querey: <argument>, sort-by: <argument> } and cb 
//Function that builds queries based on what you pass in
' use strict '; 
var elasticsearch = require('elasticsearch')

function Searchnpm (esUrl){ 
  if (esUrl) this.esUrl = esUrl
  else if(process.env.NODE_ENV === 'development') this.esUrl = 'http://localhost:9200/npm'
  else this.esUrl = 'http://localhost:9200/npm' //production ElasticSearch url will change when in actual production production will be default 
  var _this = this 
  this.client = new elasticsearch.Client({ 
    host: _this.esUrl
  })
  this.client.ping({ 
    requestTimeout: 1000, 
    hello: "elasticsearch!"
  }, function (error) { 
    if (error) throw Error('Elasticsearch is having trouble connecting the url you gave it') 
    else console.log('connected to ES')   
  })
  this["validObj"] = {'search-by': 'field', 'search-query': 'query', 'sort-by': 'something'}  
  this["valid_search-by"] = ['keyword', 'description', 'packagename', 'author', 'contributors', 'dependants']
  this["valid_sort-by"] = ['relevance', 'issues', 'stars', 'githubstars']
}

Searchnpm.prototype.searchPackages = function (searchObj, callback){ 
  searchObj = this.validateJson(searchObj)
}

Searchnpm.prototype.validateJson = function (searchObj){
  if (typeof searchObj === 'object'){
    Object.keys(this.validObj).forEach(function (key) {
      if (!searchObj.hasOwnProperty(key)) 
        throw Error('You passed in an invalid JSON obj\n, it should look like{ search-by: <argument>, search-querey: <argument>, sort-by: <argument> }')
    })
    //check if the keys contain properValues in them
    if (this["valid_search-by"].indexOf(searchObj["search-by"]) === -1) // its not there
      throw Error('The search-by field must be one of the follwing' + this["valid_search-by"]) 
    if(this["valid_sort-by"].indexOf(searchObj["sort-by"]) === -1)
      throw Error('The sort-by field must be one of the following' + this["valid_sort-by"]) 
    return searchObj  
  }else if(typeof searchObj === 'string'){ 
    //make a default JSON object to search by
    var tempObj = {} 
    Object.keys(this.validObj).forEach(function (key){ 
      if (key === 'search-by') 
        tempObj[key] = 'packagename'
      if (key === 'search-query') 
        tempObj[key] = searchObj //searchObj was passed in as a string
      if (key === 'sort-by') 
        tempObj[key] = 'relevance' 
    })
    return tempObj
  }else
    throw Error('You must either pass in a string or an object to make a query') 
} 

//function that creates properQueries to ES 
//parse through the searchObj 
//take 
Searchnpm.prototype.buildQueries = function (searchObj){ 

}   

module.exports = Searchnpm
