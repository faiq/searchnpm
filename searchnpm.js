//TODO: 
//Input JSON that might look like { searchBy: <argument>, search-querey: <argument>, sortBy: <argument> } and cb 
//Function that builds queries based on what you pass in
' use strict '; 
var elasticsearch = require('elasticsearch')
  , QueryFactory = require('./lib/QueryFactory') 

function Searchnpm (esUrl){ 
  if (esUrl) this.esUrl = esUrl
  else if(process.env.NODE_ENV === 'development') this.esUrl = 'http://localhost:9200/npm'
  else this.esUrl = 'http://www-3.aws-east.internal.npmjs.com:9200/npm' //production ElasticSearch url will change when in actual production production will be default 
  var _this = this 
  this.client = new elasticsearch.Client({ 
    host: _this.esUrl
  })
  this.client.ping({ 
    requestTimeout: 1000, 
    hello: 'elasticsearch!'
  }, function (error) { 
    if (error) throw Error('Elasticsearch is having trouble connecting the url you gave it') 
    else console.log('connected to ES')   
  })
  this.allKeys = ['searchBy' , 'searchQuery', 'sortBy', 'page', 'sortOrd', 'from', 'size']
  this.mandKeys = ['searchQuery']  
  this.validSearchBy = ['keyword', 'description', 'packagename', 'author', 'maintainers', 'dependencies', 'general']
  this.vaildSortBy = ['relevance', 'issues', 'stars', 'githubstars', 'downloads', 'date']
}

Searchnpm.prototype.searchPackages = function (searchObj, callback){ 
  searchObj = this.validateJson(searchObj)
  var query = this.buildQueries(searchObj)
  if (query){  
    this.client.search(query, function (err, results){ 
      if (err){ 
        callback(err, null)
        return
      }else {
        callback(null, results)
      } 
    })
  }
}

Searchnpm.prototype.validateJson = function (searchObj){
  if (typeof searchObj === 'object'){
    Object.keys(this.mandKeys).forEach(function (key) {
      if(!searchObj.hasOwnProperty(key)) 
        throw Error('You passed in an invalid JSON obj\n, it should look like{search-querey: <argument>}')
    })
    //fill in minimum parameters  
    searchObj.searchBy = searchObj.searchBy || 'general'
    searchObj.sortBy = searchObj.sortBy || 'relevance'
    searchObj.from = searchObj.from || 0
    searchObj.size = searchObj.size || 1000   //big number probably will end up changing in future   
    //check to see if their shit is okay 
    
    if (this.valid_searchBy.indexOf(searchObj.searchBy) === -1) // its not there
      throw Error('The searchBy field must be one of the follwing' + this.validSearchBy) 
    
    if (this.valid_sortBy.indexOf(searchObj.sortBy) === -1)
      throw Error('The sortBy field must be one of the following' + this.validSortBy)  
 
    if (searchObj.sortOrd && (searchObj.sortOrd != 'asc' || searchObj.sortOrd != 'desc'))
      throw Error('You can only sort by ascending or descending order, respectively corresponding to asc and desc')

    return searchObj  
  }else if(typeof searchObj === 'string'){ 
    //make a default JSON object to search by most likely going to be used by the cli 
    //this will make a default obj with from being 0 and size 
    var tempObj = {} 
    tempObj.searchBy = 'general'
    tempObj.sortBy = 'relevance'
    tempObj.from =  0
    tempObj.size = 1000   //big number probably will end up changing in future   
       
    return tempObj
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
      return QueryFactory.searchName(searchObj)  
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
