//TODO: 
//Input JSON that might look like { searchBy: <argument>, search-querey: <argument>, sortBy: <argument> } and cb 
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
    hello: 'elasticsearch!'
  }, function (error) { 
    if (error) throw Error('Elasticsearch is having trouble connecting the url you gave it') 
    else console.log('connected to ES')   
  })
  this['validObj'] = {'searchBy': 'field', 'searchQuery': 'query', 'sortBy': 'something'}  
  this['valid_searchBy'] = ['keyword', 'description', 'packagename', 'author', 'maintainers', 'dependencies', 'general']
  this['valid_sortBy'] = ['relevance', 'issues', 'stars', 'githubstars']
}

Searchnpm.prototype.searchPackages = function (searchObj, callback){ 
  searchObj = this.validateJson(searchObj)
  var query = this.buildQueries(searchObj)
  this.client.search(query, function (err, results){ 
    if (err){ 
      console.log(err) 
      callback(err, null)
      return
    }else {
      callback(null, results)
    } 
  })
}

Searchnpm.prototype.validateJson = function (searchObj){
  if (typeof searchObj === 'object'){
    Object.keys(this.validObj).forEach(function (key) {
      if (!searchObj.hasOwnProperty(key)) 
        throw Error('You passed in an invalid JSON obj\n, it should look like{ searchBy: <argument>, search-querey: <argument>, sortBy: <argument> }')
    })
    //check if the keys contain properValues in them
    if (this['valid_searchBy'].indexOf(searchObj['searchBy']) === -1) // its not there
      throw Error('The searchBy field must be one of the follwing' + this['valid_searchBy']) 
    if(this['valid_sortBy'].indexOf(searchObj['sortBy']) === -1)
      throw Error('The sortBy field must be one of the following' + this['valid_sortBy']) 
    return searchObj  
  }else if(typeof searchObj === 'string'){ 
    //make a default JSON object to search by
    var tempObj = {} 
    Object.keys(this.validObj).forEach(function (key){ 
      if (key === 'searchBy') 
        tempObj[key] = 'general'
      if (key === 'searchQuery') 
        tempObj[key] = searchObj //searchObj was passed in as a string
      if (key === 'sortBy') 
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
  switch (searchObj['searchBy']){
    case 'keyword': break
    case 'description': break  
    case 'packagename': break 
    case 'author': break  
    case 'maintainers': break
    case 'dependencies': break
    default: break 
  }
}   

module.exports = Searchnpm
