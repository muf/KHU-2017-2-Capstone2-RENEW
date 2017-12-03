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
            var flag = body.droneNum <= body.body.length
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
                drone.services.forEach(function(service){

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
router.post('/removeServiceFromDrone',cors(), function(req,res){
 
    async.waterfall([
        function (callback) {  
            dao.getServiceById(req, res, function(err, res, service){
                if (err) callback(err, service)
                else{
                    callback(null, service)
                }
            })
        },function(result, callback){  
            dao.removeServiceFromDrone(req, res, function(err, res, result){
                if (err) callback(err, result)
                callback(null, result)
            })
        },
        function(result, callback){
            if(result.err != undefined){
                callback(null, {err:result.err})
            }
            else{
                req.body.state = "delete"
                dao.updateServiceState(req, res, function(err, res, drone){
                    if(err) callback(err)
                    callback(null, result)
                })
            }
        },
      ], function (err, result) {
        if(err) return res.status(500).send("fail")
        res.json(result)
      });
})
router.post('/remove',cors(), function(req,res){
    dao.remove(req, res, function(err, res, result){
        if(err) return res.status(500).send("fail")
        res.json(result)
    })
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
            var flag = data.service.drone.num <= data.drones.length
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
                    data.applicationModelInput.push({
                            id:data.drones[i]._id,
                            mac: data.drones[i].mac
                        })
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
                    if(service.serviceStartDate.getTime() > new Date().getTime()){
                        var err = {message:"서비스 기간이 아닙니다."}
                        callback(null, {err})
                    }
                    else if(service.serviceEndDate.getTime() < new Date().getTime()){
                        var err = {message:"이미 만료된 서비스 입니다."}
                        callback(null, {err})
                    }
                    else{
                        callback(null, service)
                    }
                }
            })
        },
        function (service,callback) {

            if(service.err != undefined){
                callback(null, {err:service.err})
            }
            else{
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
router.post('/getDroneByIds',cors(), function(req, res) {
    dao.getDroneByIds(req, res, function(err, res, drone){
        if(err) return res.status(500).send("fail")
        res.json(drone);
    })
}) 

router.post('/saveInputBlob', cors(), function(req, res) {
    var input = JSON.stringify(req.body.input)
    var serviceId = req.body.serviceId
    var inputPath = '/Users/junghyun.park/Desktop/git/KHU-2017-2-Capstone2-RENEW/blob/input/'
    var fileName = new Date().getTime()
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

            var stream = fs.readFileSync(path)
            var data = JSON.parse(JSON.parse(stream))
            result = dbscan.run(data[seq], 20, 3, util.distanceTo);
            data[seq].forEach(x=>{x.cluster=0},data[seq])
            for(idx in result){
                for(jdx in result[idx]){
                    data[seq][result[idx][jdx]].cluster = Number(idx)+1
                }
            }
            res.json(data[seq])
        });
})


module.exports = router