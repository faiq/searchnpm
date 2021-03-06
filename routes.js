var restify = require('restify')
  , Searchnpm = require('./searchnpm') 
  , searchClient = new Searchnpm()
 

var server = restify.createServer({
  //certificate: ,
  //key: , 
  name: 'npmSearch'
});

server.use(restify.queryParser());
server.use(restify.bodyParser()); 

server.post('/search', function(req, res, cb) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  console.log(req.body)  
  console.log(req.params) 

  searchClient.searchPackages(req.params, function(err,results){ 
    if (err) return next(err);
    res.send(results) 
  }) 
}) 


server.listen(4000);
