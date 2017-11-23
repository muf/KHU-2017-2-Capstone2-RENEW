var express = require('express')
var router = express.Router()
var app = express();

var dir = new Map();
dir.set('view', __dirname +"/../view/")
dir.set('private', __dirname +"/../private/")

var serviceApplicationDAO = require(dir.get('private') + 'javascript/common/serviceApplicationDAO.js')
var bash = require(dir.get('private') + 'javascript/common/bash.js')

router.get('/newServiceRequest',function(req, res, next) {
  console.log('get /newServiceRequest@')
  var basePath = '/Users/junghyun.park/Desktop/git/KHU-2017-2-Capstone2-RENEW'
  var path = '/sh_scripts/'
  var query = basePath + path + 'runse'
  bash.run(query, function(pid){
    console.log("123")
    console.log(pid)
    res.end();
  })
});

router.get('/submitServicePage',function(req, res, next) {
  console.log('get /submitServicePage@');

  var appliedServices = serviceApplicationDAO.getServicesByState(res,'submit', function(res, list){
    res.render(dir.get('view') + '/submitServicePage.ejs',{submitList: list});
  })
});

// @ajax GET
// @ajax POST

// @app use
app.use(function(err, req, res, next) {
  console.log("error check");
  console.log(err);
})

module.exports = router