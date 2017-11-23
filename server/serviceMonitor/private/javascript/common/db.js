
// @ drone
var drone = require('../../../model/drone')
function putDrone(req, res, callback){
    drone.create({
        ip: req.body.ip,
        port: req.body.port,
        model: req.body.model,
        state: req.body.state
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

// @ serviceApplication
var serviceApplication = require('../../../model/serviceApplication')
function putService(req, res, callback){
    serviceApplication.create({
        serviceStartDate: req.body.serviceStartDate,
        serviceEndDate: req.body.serviceEndDate,
        drone:{min: req.body.droneMin, max: req.body.droneMax},
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
function getServicesByState(req, res, state, callback){
    serviceApplication.findByState(state, function(err, services){
        if(typeof callback === 'function') {
            if(err) return callback(err, res, services)
            else return callback(undefined, res, services)
        }
    }, res)
}
function updateService(req, res, callback){
    serviceApplication.update( {
        _id: req.body.objectId            
    },
    {$set:{ state: req.body.state}},
    function(err, serviceApplication) {
        if(typeof callback === 'function') {
            if(err) return callback(err, res, serviceApplication)
            else return callback(undefined, res, serviceApplication)
        }
    });
}

module.exports.getServicesByState = getServicesByState
module.exports.updateService = updateService
module.exports.putService = putService
module.exports.putDrone = putDrone
module.exports.getDrones = getDrones