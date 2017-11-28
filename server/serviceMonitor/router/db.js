var express = require('express')
var router = express.Router()
var request = require('request')
var app = express()
var cors = require('cors');
var async = require('async');
var fs = require('fs');

var clustering = require('density-clustering')
var dbscan = new clustering.DBSCAN()
// @ create db connector
var mongoose = require('mongoose')
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
var util = require(dir.get('private') + 'javascript/common/util.js')

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
router.post('/addDrone',cors(), function(req, res) {
    dao.putDrone(req, res, function(err, res, drone){
        if(err) return res.status(500).send("fail")
        res.status(200).send(drone);
    })
})
router.post('/updateDroneGPS',cors(), function(req, res) {
    dao.putDrone(req, res, function(err, res, drone){
        if(err) return res.status(500).send("fail")
        res.status(200).send(drone);
    })
})
router.post('/updateServiceApplicationState',cors(), function(req, res) {
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
                    // if(service.serviceStartDate <= new Date(serviceEndDate)){
                    //     flag = false
                    // }
                    // if(service.serviceEndDate >= new Date(serviceStartDate)){
                    //     flag = false
                    // }
                    var condition1 = 
                        service.serviceStartDate <= new Date(serviceEndDate) 
                        &&  new Date(serviceEndDate) <= service.serviceEndDate
                    var condition2 = 
                        service.serviceStartDate <= new Date(serviceStartDate) 
                        &&  new Date(serviceStartDate) <= service.serviceEndDate
                    var condition3 = 
                        service.serviceStartDate > new Date(serviceStartDate) 
                        &&  new Date(serviceEndDate) > service.serviceEndDate
                    
                    if(condition1 || condition2 || condition3){
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
            var flag = service.blob.fileName == "" ? false : true
            if(flag){
                request({
                    url:'http://localhost:3002/newServiceRequest',
                    method:"POST",
                    json:true,
                    body:service,
                    },function (err, response, body) {
                        if (err) callback(err, true)
                        callback(null, body)
                    }
                )
            }
            else{
                var err = {message:"입력 데이터가 없습니다."}
                callback(null, {err})
            }
        },
        function(result, callback){
            if(result.err != undefined){
                callback(null, {err:result.err})
            }
            else{
                req.body.state = "execute"
                req.body.pid = result.pid
                req.body.port = Number(result.port)
                dao.updateServiceState(req, res, function(err, res, drone){
                    if(err) callback(err)
                    callback(null, result)
                })
            }
        },
        function(result, callback){
            if(result.err != undefined){
                callback(null, {err:result.err})
            }
            else{
                req.body.server = { // executor server
                    pid: req.body.pid,
                    ip: "127.0.0.1",
                    port:  req.body.port
                }
                dao.updateServiceAddress(req, res, function(err, res, drone){
                    if(err) callback(err)
                    callback(null, result)
                })
            }
        }
    ]
    async.waterfall(tasks, function (err, results) {
        if(err) return res.status(500).send("fail")
        res.json(results)
    })
})

router.post('/getServiceApplication',cors(), function(req, res) {
    dao.getServiceById(req, res, function(err, res, drone){
        if(err) return res.status(500).send("fail")
        res.status(200).send(drone);
    })
}) 

router.post('/saveInputBlob', cors(), function(req, res) {
    var input = JSON.stringify(req.body.input)
    var serviceId = req.body.serviceId
    var inputPath = '/Users/junghyun.park/Desktop/git/KHU-2017-2-Capstone2-RENEW/blob/input/'
    var fileName = new Date().getTime()+'.input'
    req.body.fileName = fileName
    fs.writeFile(inputPath + fileName, input, function(err) {
        if(err) {
            console.log(err)
            return res.status(500).send("fail")
        }
        //fileName
        dao.updateServiceBlob(req,res,function(err,res,result){
            if(err) return res.status(500).send("fail")
            console.log("data input ")
            res.json("ok")
        })
    });
    // 1511701830769
}) 
router.post('/saveOutputBlob', cors(), function(req, res) {
    var input = JSON.stringify(req.body.input)
    var serviceId = req.body.serviceId
    var inputPath = '/Users/junghyun.park/Desktop/git/KHU-2017-2-Capstone2-RENEW/blob/output/'

    async.waterfall([
        function (callback) {  
            dao.getServiceById(req, res, function(err, res, service){
                if (err) callback(err, service)
                else{
                    callback(null, service)
                }
            })
        }
      ], function (err, service) {
        fs.writeFile(inputPath + service.blob.fileName, input, function(err) {
            if(err) {
                console.log(err)
                return res.status(500).send("fail")
            }
            res.json("ok")
        });
      });

   
    // 1511701830769
}) 

router.post('/getBlobData',cors(), function(req, res) {
    var path = req.body.path
    console.log(path)
    var stream = fs.readFileSync(path)
    var data = JSON.parse(JSON.parse(stream))
    res.json(data)
    // 1511701830769
}) 
router.post('/getClusteredData', cors(), function(req, res) {
    var path = req.body.path
    var seq = req.body.seq
    async.waterfall([
        function(callback){
            request({
                url : "http://localhost:3002/makeClusteredData",
                method:"POST",
                json:true,
                body:{path, seq},
                },function (err, response, path) {
                    if (err) callback(err, true)
                    callback(null, path)
                }       
        )}
        ], function (err, path) {
            if(err) res.status(500).send("fail")
            console.log(path)
            var stream = fs.readFileSync(path)
            var data = JSON.parse(JSON.parse(stream))
            // 임시로 cluster 넣어서 진행
            console.log(util)
            result = dbscan.run(data[seq], 10, 3, util.distanceTo);
            data[seq].forEach(x=>{x.cluster=0},data[seq])
            for(idx in result){
                for(jdx in result[idx]){
                    data[seq][result[idx][jdx]].cluster = Number(idx)+1
                }
            }
            console.log("result : " + JSON.stringify(result))
            console.log("noise: " + JSON.stringify(result))
            res.json(data[seq])
        });
}) 
// router.post('/getInputBlob', function(req, res) {
//     var input = JSON.stringify(req.body.input)
//     var inputPath = '/Users/junghyun.park/Desktop/git/KHU-2017-2-Capstone2-RENEW/blob/input/'
//     fs.writeFile(inputPath +new Date().getTime()+'.input', input, function(err) {
//         if(err) return res.status(500).send("fail")
//         res.json()
//     });
// }) 


module.exports = router