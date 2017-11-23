var express = require('express')
var router = express.Router()
var request = require('request')
var app = express()
var cors = require('cors');
var async = require('async');
// @ create db connector
var mongoose = require('mongoose');
mongoose.connect('mongodb://root:admin@ds117136.mlab.com:17136/ap-in-the-sky',{
    useMongoClient: true
  })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log("mongo db connection OK.");
});

var dir = new Map();
dir.set('view', __dirname +"/../view/")
dir.set('private', __dirname +"/../private/")

// @ load models & methods
var dao = require(dir.get('private') + 'javascript/common/db.js')

// APIs
// cross domain request 허용
router.post('/createServiceApplication', cors(), function(req, res) { 
    var tasks = [
        function (callback) {
            request({
                url:'http://localhost:3002/applyCheck',
                method:"POST",
                json:true,
                body:req.body,
                },function (err, response, body) {
                    if (err) callback(err, true)
                    callback(null, body)
                }
            )
        },
        function(body, callback){
            var flag = req.body.droneNum < body.length
            callback(null, {flag:flag,drones:body})
        },
        function (data, callback) {
            if(data.flag){
                dao.putService(req, res, function(err, res, serviceApplication){
                    if (err) callback(err, serviceApplication)
                    callback(null, serviceApplication)
                })
            }
            else{
                callback("fail")
            }
        }
    ]
    async.waterfall(tasks, function (err, results) {
        if(err) return res.status(500).send("fail")
        res.status(200).send("success");
    })
})
router.post('/addDrone', function(req, res) {
    dao.putDrone(req, res, function(err, res, drone){
        if(err) return res.status(500).send("fail")
        res.status(200).send(drone);
    })
})
router.post('/updateServiceApplicationState', function(req, res) {
    dao.updateService(req, res, function(err, res, drone){
        if(err) return res.status(500).send("fail")
        res.status(200).send(drone);
    })
})
router.post('/applyCheck',cors(), function(req, res) {
    var tasks = [
        function (callback) {  
            dao.getDrones(req, res, function(err, res, drones){
                if (err) callback(err, drones)
                else{
                    callback(null, drones)
                }
            })
        }
    ]
    async.parallel(tasks, function (err, results) {
        if(err) return res.status(500).send("fail")
        else{
            console.log(results)
            var serviceStartDate = req.body.serviceStartDate
            var serviceEndDate = req.body.serviceEndDate
            var list = []
            results[0].forEach(function(drone){
                console.log(drone.executors)
                var flag = true
                // 충전시간 및 비행 시간도 고려해야함. 나중에 중심부까지 날아가는 시간 고려하는 것도 만들어야 함. 일단은 고려하지 않음.
                drone.executors.forEach(function(executor){
                    if(executor.serviceStartDate <= serviceEndDate){
                        flag = false
                    }
                    if(executor.serviceEndDate >= serviceStartDate){
                        flag = false
                    }
                },serviceStartDate, serviceEndDate, flag)
                if(flag){
                    list.push(drone)
                }
            },serviceStartDate, serviceEndDate, list)

            res.json(list) //가능한 드론들 return 
        }
    });
})
router.post('/executeService', cors(), function(req, res) { 
    var tasks = [
        function (callback) {  
            dao.getServiceById(req, res, function(err, res, service){
                if (err) callback(err, service)
                else{
                    callback(null, service)
                }
            })
        },
        function (service,callback) {
            request({
                url:'http://localhost:3002/applyCheck',
                method:"POST",
                json:true,
                body:service,
                },function (err, response, body) {
                    if (err) callback(err, true)
                    callback(null, body)
                }
            )
        },
        function(body, callback){
            var flag = req.body.droneNum < body.length
            callback(null, {flag:flag,drones:body,})
        },
        function (data, callback) {  
            if(data.flag){ // 할당 할 수 있는 드론이 있음
               // 
            }
            else{
                callback("fail")
            }
        }
    ]
    async.waterfall(tasks, function (err, results) {
        if(err) return res.status(500).send("fail")
        res.status(200).send("ok");
    })
})



module.exports = router