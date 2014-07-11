var lab = require('lab') 
  , Searchnpm = require('../searchnpm')
  , child_process = require('child_process') 
  , describe = lab.describe
  , it = lab.it 
  , before = lab.before
  , expect = lab.expect

'use strict'; 

describe('The constuctor',function () {
  it('should connect to the elasticsearch you tell it', function(done){ 
    var url = 'http://127.0.0.1:9200' 
    var search = new Searchnpm(url) 
    expect(search.esUrl).to.equal(url)
    done()   
  }) 
  it('should have a default elasticsearch to connect to', function (done){ 
    var search = new Searchnpm()
    expect(search.esUrl).to.equal('http://localhost:9200/npm')
    done()
  })
  it('should make a new elasticsearch instance', function(done){ 
    var search = new Searchnpm()
    expect(search.client).to.be.ok
    done() 
  })
  it('should throw an error when it can\'t connect to ES', function(done){ 
    var dummy = child_process.spawn(process.execPath, [__filename, 'crashtestdummy'])
    dummy.on('close', function (code, signal) {
      console.log(code) 
      clearTimeout(timer)
      done(); 
    }) 
    dummy.stderr.on('data', function (data) {
      console.log('stderr: ' + data)
      //read the console log to make sure the Error thrown is the one trown from the file
      clearTimeout(timer)
      done();
    })
    var timer = setTimeout(function(){
      expect(1).to.equal(0) 
      done()
    }, 1500)
  })  
})
//Helper functions for the test above
if (process.argv[2] === "crashtestdummy") {
  return crashTestDummy()
}

function crashTestDummy() {
  var Searchnpm = require('../searchnpm')
  var url = 'http:localhost:8000/'
  var search = new Searchnpm(url) 
}

describe('JSON validator', function (){ 
    it('should throw an error when you give it invalid JSON', function (done){
      var search = new Searchnpm()
      var badJson = {}
      expect(validator).to.throw(Error)
      function validator(badJson) {
        search.validateJson(badJson)
      }  
      done()
    })
    it('should have default values if you pass in just a string', function (done){
      var search = new Searchnpm()
      var searchString = 'express' 
      expect(search.validateJson(searchString)).to.be.an('object')
      //make sure it has the right fields
      expect(search.validateJson(searchString)["search-by"]).to.be.ok
      expect(search.validateJson(searchString)["search-query"]).to.be.ok
      expect(search.validateJson(searchString)["sort-by"]).to.be.ok
      done() 
    })
})   

