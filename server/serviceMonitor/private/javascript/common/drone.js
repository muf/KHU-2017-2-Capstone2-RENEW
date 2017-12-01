var drone = {}
drone.connections = new Map()

var dao = require('./db.js')

// connect sub apps

process.on('SIGINT',function(){
    console.log("SIGINT")
    process.exit()
})

drone.isConnected =  function(mac){
    return drone.connections.has(mac)
}
drone.disconnect = function(mac){
    if(drone.isConnected(mac)){
        drone.connections.delete(mac)
        var req = {}
        req.body = {}
        req.body.state = "waiting"
        req.body.mac = mac
        dao.putDrone(req,null)
    }
}
drone.connect = function(mac){
    if(drone.isConnected(mac)){
        drone.connections.get(mac).count += 1 // test code
    }
    else{
        var req = {}
        req.body = {}
        req.body.state = "ready"
        req.body.mac = mac
        dao.putDrone(req,null)
        drone.connections.set(mac,{executor_buffer:[], drone_buffer:[], err_buffer:[],count:0})   
        drone.connections.get(mac).lock = false
    }
}
drone.send = function(mac,msg, callback){
    if(!drone.isConnected(mac)){
        var err = { message: "drone is not connect" }
        console.log(`input for mac ${mac}`)
        console.log("1: "+JSON.stringify(msg))
        console.log("2: "+msg)
        callback(err)
    }
    else{
        drone.connections.get(mac).drone_buffer.push(msg)
        console.log(`input for mac ${mac}`)
        console.log("1: "+JSON.stringify(msg))
        console.log("2: "+msg)
        callback(null)
    }
}
drone.receive = function(mac){
    if(!drone.connections.get(mac).lock){
        drone.connections.get(mac).lock = true
        if(drone.isConnected(mac)){
            var msg = Object.assign([],drone.connections.get(mac).drone_buffer)
            drone.connections.get(mac).drone_buffer = []
            drone.connections.get(mac).lock = false
            return msg
        }
        else{
            drone.connections.get(mac).lock = false
            return "no connection" 
        }
    }
}
function sayHello(rawList){
    
}
module.exports = drone