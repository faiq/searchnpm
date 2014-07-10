//TODO: 
//Input JSON that might look like { search-by: <argument>, search-querey: <argument>, sort-by: <argument> } and cb 
//Function that builds queries based on what you pass in
var elasticsearch = require('elasticsearch');

function Searchnpm (esUrl){ 
  if (esUrl) this.esUrl = esUrl
  else if(process.env.NODE_ENV === 'development') this.esUrl = 'http://localhost:9200'
  else this.esUrl = 'http://localhost:9200'
}

Searchnpm.prototype.searchPackages = function (searchObj, callback){ 

}

Search.prototype.makeQueries = function (searchObj){ 

}   
