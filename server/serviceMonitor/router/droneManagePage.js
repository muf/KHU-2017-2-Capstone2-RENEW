var express = require('express')
var router = express.Router()
var app = express();

var dir = new Map();
dir.set('view', __dirname +"/../view/")
dir.set('private', __dirname +"/../private/")

var droneDAO = require(dir.get('private') + 'javascript/common/droneDAO.js')

router.get('/droneManagePage',function(req, res, next) {
  console.log('get /droneManagePage');

  var drones = droneDAO.getDrones(res,'submit', function(res, list){
    res.render(dir.get('view') + '/droneManagePage.ejs',{droneList: list});
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