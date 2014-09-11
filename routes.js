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

server.post('/', function(req, res, cb) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  searchClient.searchPackages(req.body, function(err,results){ 
    if (err) return next(err);
    res.send(results) 
  }) 
}) 


server.listen(4001);
