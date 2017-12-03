
var serverURI = "http://14.33.77.250"
var serviceMonitorPort=":3002"
function addKeyboardEvent(){

    keyTimer={}
    keyTimer.q={cmd:"up"}
    keyTimer.w={cmd:"forward"}
    keyTimer.e={cmd:"down"}
    keyTimer.a={cmd:"left"}
    keyTimer.s={cmd:"backward"}
    keyTimer.d={cmd:"right"}
    keyTimer.j={cmd:"takeOff"}
    keyTimer.k={cmd:"land"}
    keyTimer.l={cmd:"stop"}

    window.addEventListener('keyup',function(e) {
        if(keyTimer[e.key]!=undefined){
            keyTimer[e.key].duration = (performance.now() - keyTimer[e.key].temp)
        }
    });window.addEventListener('keydown',function(e) {
        if(keyTimer[e.key]!=undefined){
            keyTimer[e.key].temp = performance.now()
            command(keyTimer[e.key].cmd)
        }
    });
    
}
addKeyboardEvent()
function command(cmd,params){
    list = [
        "land",
        "stop",
        "takeOff",
        "forward",
        "backward",
        "right",
        "left",
        "up",
        "down",
        "sendGps",
        "move"
    ]
    if(list.includes(cmd)){
        var msg = {cmd,date:new Date()}
        if(params){
            msg.position = {lat: params.lat, lng: params.lng}
        }
        $.ajax({
            url : serverURI + serviceMonitorPort + "/send",
            method:"POST",
            json:true,
            data:{
                mac:window.location.search.split("?mac=")[1],
                msg
            },
            },function (err, response, body) {
                if (err) console.log(err)
                console.log(body)
            }
        ) 
    }
    else{
        console.log("unknown command.")
    }
}
function go(){
    var lat = $('#lat').val()
    var lng = $('#lng').val()
    var params = {lat, lng}
    if(lat!="" && lng !=""){
        lat = Number(lat)
        lng = Number(lng)
        command("move",params)
    }
}