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
                    callback(null, {body:body,droneNum: Number(JSON.parse(response.request.body).drone.num)})
                }
            )
        },
        function(body, callback){
            var flag = body.droneNum < body.body.length
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
                var err = {message:"드론 수가 부족합니다."}
                callback(null, {err})
            }
        }
    ]
    async.waterfall(tasks, function (err, results) {
        if(err) return res.status(500).send("fail")
        res.json(results);
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
            var serviceStartDate = req.body.serviceStartDate
            var serviceEndDate = req.body.serviceEndDate
            var list = []
            results[0].forEach(function(drone){
                var flag = true
                // 충전시간 및 비행 시간도 고려해야함. 나중에 중심부까지 날아가는 시간 고려하는 것도 만들어야 함. 일단은 고려하지 않음.
                drone.services.forEach(function(service){
                    if(service.serviceStartDate <= new Date(serviceEndDate)){
                        flag = false
                    }
                    if(service.serviceEndDate >= new Date(serviceStartDate)){
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
router.post('/submitService', cors(), function(req, res) { 
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
                    callback(null, {drones:body,service: JSON.parse(response.request.body)})
                }
            )
        },
        function(data, callback){
            var flag = data.service.drone.num < data.drones.length
            callback(null, {flag:flag,drones:data.drones, service: data.service})
        },
        function (data, callback) {  
            if(data.flag){ // 할당 할 수 있는 드론이 있음
                // 할당
                // 드론에 services list push 
                // services drone.list에 드론 추가
               // 성공 시 성공 방환
                data.applicationModelInput = []
                for(var i = 0; i < data.service.drone.num; i++){
                    data.applicationModelInput.push({id:data.drones[i]._id})
                }   
                data.droneModelInput = {
                    id: data.service._id, 
                    serviceStartDate: data.service.serviceStartDate,
                    serviceEndDate: data.service.serviceEndDate
                }
                req.body = data
                dao.submitServiceApplication(req, res, function(err, res, service){
                    if (err) {
                        console.log(err.message)
                        callback(err)
                    }
                    else{
                        callback(null, data)
                    }
                })
               
            }
            else{
                var err = {message:"드론 수가 부족합니다."}
                callback(null, {err})
            }
        }
    ]
    async.waterfall(tasks, function (err, results) {
        if(err) return res.status(500).send("fail")
        res.json(results)
    })
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

router.post('/getServiceApplication', function(req, res) {
    dao.getServiceById(req, res, function(err, res, drone){
        if(err) return res.status(500).send("fail")
        res.status(200).send(drone);
    })
}) 


module.exports = router