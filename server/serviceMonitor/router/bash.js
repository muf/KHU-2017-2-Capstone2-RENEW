var express = require('express')
var router = express.Router()
var app = express();

var dir = new Map();
dir.set('view', __dirname +"/../view/")
dir.set('private', __dirname +"/../private/")

var bash = require(dir.get('private') + 'javascript/common/bash.js')

// @ handle bash requests
router.get('/newServiceRequest',function(req, res, next) {
  var testmode = true

  // executor 실행
  if(!testmode){
    var basePath = '/Users/junghyun.park/Desktop/git/KHU-2017-2-Capstone2-RENEW'
    var path = '/sh_scripts/'
    var query = basePath + path + 'runse'
    bash.run(query, function(pid){
      console.log(pid)
      res.end();
    })
  }
  else{
    res.end();
  }
})
    

  // @app use
app.use(function(err, req, res, next) {
    console.log("error check");
    console.log(err);
  })
  
  module.exports = router