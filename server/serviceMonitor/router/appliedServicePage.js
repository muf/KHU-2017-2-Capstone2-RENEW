var express = require('express')
var router = express.Router()
var app = express();

var dir = new Map();
dir.set('view', __dirname +"/../view/")
dir.set('private', __dirname +"/../private/")

var serviceApplicationDAO = require(dir.get('private') + 'javascript/common/serviceApplicationDAO.js')

router.get('/appliedServicePage',function(req, res, next) {
  console.log('get /appliedServicePage');

  var appliedServices = serviceApplicationDAO.getServicesByState(res,'applied', function(res, list){
    res.render(dir.get('view') + '/appliedServicePage.ejs',{appliedList: list});
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