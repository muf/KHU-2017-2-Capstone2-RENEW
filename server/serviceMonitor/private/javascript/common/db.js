
// @ drone
var drone = require('../../../model/drone')
function putDrone(req, res, callback){
    data = {}
    if(req.body.ip != null)  data.ip = req.body.ip
    if(req.body.port != null)  data.port = req.body.port
    if(req.body.mac != null)  data.mac = req.body.mac
    if(req.body.state != null)  data.state = req.body.state
    if(req.body.gps != null){
        data.gps = {}
        if(req.body.gps.lat != null)  data.gps.lat = req.body.gps.lat
        if(req.body.gps.lng != null)  data.gps.lng = req.body.gps.lng
        if(req.body.gps.al != null)  data.gps.al = req.body.gps.al
    }
    
    // { ip: req.body.ip, port: req.body.port, mac: req.body.mac, state: req.body.state}
    drone.findOneAndUpdate({
            mac: req.body.mac            
        },
        {$set: data },
        {
          upsert: true,
          returnNewDocument: true
        },
    function(err, drone) {
        if(typeof callback === 'function') {
            if(err) return callback(err, res, drone)
            else return callback(undefined, res, drone)
        }
    });
}
function getDrones(req, res, callback){
    drone.findAllDrones(function(err, drones){
        if(typeof callback === 'function') {
            if(err) return callback(err, res, drones)
            else return callback(undefined, res, drones)
        }
    }, res)
}
function getDroneByIds(req, res, callback){
    var objectIds = req.body.objectIds
    drone.find({
        _id: {
            $in: objectIds
        }
   },function(err, drone){
       if(typeof callback === 'function') {
           if(err) return callback(err, res, drone)
           else return callback(undefined, res, drone)
       }
   }, res)
}

// @ serviceApplication
var serviceApplication = require('../../../model/serviceApplication')
function putService(req, res, callback){
    serviceApplication.create({
        serviceStartDate: req.body.serviceStartDate,
        serviceEndDate: req.body.serviceEndDate,
        drone:{num: req.body.drone.num},
        contact:{email: req.body.email, number: req.body.contactNumber},
        bounds:req.body.bounds
    },
    function(err, serviceApplication) {
        if(typeof callback === 'function') {
            if(err) return callback(err, res, serviceApplication)
            else return callback(undefined, res, serviceApplication)
        }
    });
}
function getServicesByState(req, res, states, callback){
    serviceApplication.findByState(states, function(err, services){
        if(typeof callback === 'function') {
            if(err) return callback(err, res, services)
            else return callback(undefined, res, services)
        }
    }, res)
}
function getServiceById(req, res, callback){
    serviceApplication.findOne({
         _id: req.body.serviceId
    },function(err, service){
        if(typeof callback === 'function') {
            if(err) return callback(err, res, service)
            else return callback(undefined, res, service)
        }
    }, res)
}
function updateService(req, res, callback){
    serviceApplication.update( {
        _id: req.body.serviceId            
    },
    {$set:{ state: req.body.state}},
    function(err, serviceApplication) {
        if(typeof callback === 'function') {
            if(err) return callback(err, res, serviceApplication)
            else return callback(undefined, res, serviceApplication)
        }
    });
}

function updateServiceState(req, res, callback){
    serviceApplication.update( {
        _id: req.body.serviceId            
    },
    {$set:{ state: req.body.state}},
    function(err, serviceApplication) {
        if(typeof callback === 'function') {
            if(err) return callback(err, res, serviceApplication)
            else return callback(undefined, res, serviceApplication)
        }
    });
}
function submitServiceApplication(req, res, callback){
        for(var i = 0; i < req.body.applicationModelInput.length; i++){
            drone.update({
                _id: req.body.applicationModelInput[i].id
            },
            {$push:{
                services: req.body.droneModelInput
            }
            },
            function(err, result) {
                console.log(err)
            })
        }
        serviceApplication.update( {
            _id: req.body.service._id     
        },
        {$set:{
            "drone.list": req.body.applicationModelInput,
            state: 'submit'
        }},
        function(err, serviceApplication) {
            if(typeof callback === 'function') {
                if(err) return callback(err, res)
                else return callback(undefined, res)
            }
    });
}

function updateServiceBlob(req, res, callback){
    serviceApplication.update( {
        _id: req.body.serviceId            
    },
    {$set:{ "blob.fileName": req.body.fileName}},
    function(err, serviceApplication) {
        if(typeof callback === 'function') {
            if(err) return callback(err, res, serviceApplication)
            else return callback(undefined, res, serviceApplication)
        }
    });
}
function updateServiceAddress(req, res, callback){
    serviceApplication.update( {
        _id: req.body.serviceId            
    },
    {$set:{ "server": req.body.server}},
    function(err, serviceApplication) {
        if(typeof callback === 'function') {
            if(err) return callback(err, res, serviceApplication)
            else return callback(undefined, res, serviceApplication)
        }
    });
}
function removeDrone(req, res, callback){
    var objectId = req.body.objectId
    drone.remove({
        _id: objectId
    },
    function(err, result) {
        if(typeof callback === 'function') {
            if(err) return callback(err, res, result)
            else return callback(undefined, res, result)
        }
    });
}
function removeServiceFromDrone(req, res, callback){

    var serviceId = req.body.serviceId

    drone.update(
        {},
        {$pull: { 
            services: {
                id:serviceId
            }
        }
        },
        {multi: true},
        function(err, result) {
            if(typeof callback === 'function') {
                if(err) return callback(err, res, result)
                else return callback(undefined, res, result)
            }
        })
    // db.stores.update(
    //     { },
    //     { $pull: { fruits: { $in: [ "apples", "oranges" ] }, vegetables: "carrots" } },
    //     { multi: true }
    // )
}

module.exports.removeDrone = removeDrone
module.exports.removeServiceFromDrone = removeServiceFromDrone
module.exports.updateServiceAddress = updateServiceAddress
module.exports.submitServiceApplication = submitServiceApplication
module.exports.getServicesByState = getServicesByState
module.exports.getServiceById = getServiceById
module.exports.updateService = updateService
module.exports.updateServiceBlob = updateServiceBlob
module.exports.updateServiceState = updateServiceState
module.exports.putService = putService
module.exports.putDrone = putDrone
module.exports.getDrones = getDrones
module.exports.getDroneByIds = getDroneByIds