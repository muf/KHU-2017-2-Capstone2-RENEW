
var express = require('express')
var router = express.Router()
var app = express();
var request = require('request')
var async = require('async');

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
});// @ rendering pages (VIEW)

router.get('/finishedPage',function(req, res, next) {
    dao.getServicesByState(req, res,['finished','execute'], function(err, res, services){
        if (err) return res.status(500).send("get services by state FAIL");
        res.render(dir.get('view') + '/finishedPage.ejs',{submitList: services});
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

router.get('/resultPage?:serviceId',function(req, res, next) {
    var serviceId = req.query.serviceId
    // 결과물 읽어서 json 형태로 가져온 다음 넘기자.
    // test로 가져오자 일단.
    req.body.serviceId = serviceId
    async.waterfall([
        function (callback) {  
          request({
              url:'http://localhost:3002/getServiceApplication',
              method:"POST",
              json:true,
              body:req.body,
              },function (err, response, body) {
                  if (err) callback(err, data)
                  callback(null, body)
              }
          )
        },//getServiceApplication
        function(result, callback){
            req.body.path = result.blob.outputBasePath + result.blob.fileName // @@@ 임시로 inputBasePath로 설정
            req.body.service = result
            request({
                url:'http://localhost:3002/getBlobData',
                method:"POST",
                json:true,
                body:req.body,
                },function (err, response, body) {
                    if (err) callback(err, data)
                    callback(null, body)
                }
            )
        }
      ], function (err, data) {
            res.render(dir.get('view') + '/resultPage.ejs',{data: data})
      });
    
  });

app.use(function(err, req, res, next) {
    console.log("error check");
    console.log(err);
  })
  
module.exports = router