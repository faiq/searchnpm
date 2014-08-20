//TODO: 
//Input JSON that might look like { searchBy: <argument>, search-querey: <argument>, sortBy: <argument> } and cb 
//Function that builds queries based on what you pass in
' use strict '; 
var elasticsearch = require('elasticsearch')
  , QueryFactory = require('./lib/QueryFactory') 

function Searchnpm (esUrl){ 
  if (esUrl) this.esUrl = esUrl
  else this.esUrl = 'http://localhost:9200/npm'
  var _this = this 
  this.client = new elasticsearch.Client({ 
    host: _this.esUrl
  })
  this.ready = false
  var _this = this 
  this.client.ping({ 
    requestTimeout: 1000, 
    hello: 'elasticsearch!'
  }, function (error) { 
    if (error) throw Error('Elasticsearch is having trouble connecting the url you gave it') 
    else{ 
      console.log('connected to ES')
      _this.ready = true
    } 
  })
  this.allKeys = ['searchBy' , 'searchQuery', 'sortBy', 'page', 'sortOrd', 'from', 'size']
  this.mandKeys = ['searchQuery']  
  this.validSearchBy = ['keyword', 'description', 'packagename', 'author', 'maintainers', 'dependencies', 'general']
  this.vaildSortBy = ['relevance', 'issues', 'stars', 'githubstars', 'downloads', 'date']
  this.retryCounter = 0
}

Searchnpm.prototype.searchPackages = function (searchObj, callback){ 
  var _this = this
  searchObj = this.validateJson(searchObj)
  var query = this.buildQueries(searchObj)
  if (this.ready){  
    this.client.search(query, function (err, results){ 
      if (err){ 
        callback(err, null)
        return
      }else {
        callback(null, results)
      } 
    })
  }else{ 
    if (this.retryCounter == 5){
      callback({err: 'search retried too many times'}, null) 
      process.exit(0)  
    }  
    setTimeout(function(){ 
      _this.searchPackages(searchObj, callback) 
      _this.retryCounter++
    }, 1500)
  }
}
Searchnpm.prototype.validateJson = function (searchObj){
  if(typeof searchObj === 'string'){ 
    //make a default JSON object to search by most likely going to be used by the cli 
    //this will make a default obj with from being 0 and size 
    var tempObj = {} 
    tempObj.searchBy = 'general'
    tempObj.sortBy = 'relevance'
    tempObj.from =  0
    tempObj.searchQuery = searchObj
    tempObj.size = 100   //big number probably will end up changing in future   
    return tempObj
  }else if (typeof searchObj === 'object'){
    this.mandKeys.forEach(function (key) {
      if(!searchObj.hasOwnProperty(key)) 
        throw Error('You passed in an invalid JSON obj, it should look like{searchQuery: <argument>}')
    })
    //fill in minimum parameters  
    searchObj.searchBy = searchObj.searchBy || 'general'
    searchObj.sortBy = searchObj.sortBy || 'relevance'
    searchObj.from = searchObj.from || 0
    searchObj.size = searchObj.size || 100   //big number probably will end up changing in future   
   
    if ((this.validSearchBy).indexOf(searchObj.searchBy) === -1) // its not there
      throw Error('The searchBy field must be one of the follwing' + this.validSearchBy) 
    
    if ((this.vaildSortBy).indexOf(searchObj.sortBy) === -1)
      throw Error('The sortBy field must be one of the following' + this.validSortBy)  
    
    searchObj.sortOrd= searchObj.sortOrd || 'desc' 
    
    if (searchObj.sortOrd && !(searchObj.sortOrd === 'asc' ||  searchObj.sortOrd === 'desc'))
      throw Error('You can only sort by ascending or descending order, respectively corresponding to asc and desc')

    return searchObj  
  }else
    throw Error('You must either pass in a string or an object to make a query') 
} 

//function that creates properQueries to ES 
//parse through the searchObj 
//take 
Searchnpm.prototype.buildQueries = function (searchObj){ 
  switch (searchObj['searchBy']){
    case 'keyword': 
      return QueryFactory.searchKeyword(searchObj) 
      break
    case 'description': 
      return QueryFactory.searchDescription(searchObj) 
      break  
    case 'packagename': 
      return QueryFactory.searchPackageName(searchObj)  
      break 
    case 'author': 
      return QueryFactory.searchAuthor(searchObj) 
      break  
    case 'maintainers': 
      return QueryFactory.searchMaintainers(searchObj)
      break
    case 'dependencies': 
      return QueryFactory.searchDependencies(searchObj) 
      break
    default:
      return QueryFactory.searchDefault(searchObj) 
      break 
  }
}   

module.exports = Searchnpm
