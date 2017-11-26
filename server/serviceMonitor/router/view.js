
var express = require('express')
var router = express.Router()
var app = express();

var dir = new Map();
dir.set('view', __dirname +"/../view/")
dir.set('private', __dirname +"/../private/")

// @ db access object
var dao = require(dir.get('private') + 'javascript/common/db.js')

// @ rendering pages (VIEW)
router.get('/submitServicePage',function(req, res, next) {
    dao.getServicesByState(req, res,['submit','execute'], function(err, res, services){
        if (err) return res.status(500).send("get services by state FAIL");
        res.render(dir.get('view') + '/submitServicePage.ejs',{submitList: services});
    })
});

router.get('/appliedServicePage',function(req, res, next) {
    dao.getServicesByState(req, res,['applied'], function(err, res, services){
        if (err) return res.status(500).send("get services by state FAIL");
        res.render(dir.get('view') + '/appliedServicePage.ejs',{appliedList: services});
    })
});

router.get('/droneManagePage',function(req, res, next) {
    dao.getDrones(req, res, function(err, res, drones){
        if (err) return res.status(500).send("get services by state FAIL");
        res.render(dir.get('view') + '/droneManagePage.ejs',{droneList: drones});
    })
});

router.get('/dataGeneratePage?:serviceId',function(req, res, next) {
    var serviceId = req.query.serviceId
    res.render(dir.get('view') + '/dataGeneratePage.ejs',{serviceId: serviceId})
});

app.use(function(err, req, res, next) {
    console.log("error check");
    console.log(err);
  })
  
module.exports = router