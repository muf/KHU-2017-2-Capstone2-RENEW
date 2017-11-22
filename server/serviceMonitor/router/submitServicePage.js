var express = require('express')
var router = express.Router()
var app = express();

var dir = new Map();
dir.set('view', __dirname +"/../view/")
dir.set('private', __dirname +"/../private/")

var serviceApplicationDAO = require(dir.get('private') + 'javascript/common/serviceApplicationDAO.js')

router.get('/submitServicePage',function(req, res, next) {
  console.log('get /submitServicePage');

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