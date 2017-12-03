
var app
var serviceId = location.href.split("serviceId=")[1]
var service
var dataList = []
var drones = []
var globalTest;
var realMode = true
var noiseMode = false
var serverURI = "http://14.33.77.250"
var serviceMonitorPort=":3002"
function show(event){
    realMode = false
    var index = Number(event.target.innerHTML)
    console.log(`index : ${index}`)
    app.map.wrappers.inputMarkerWrapper.clearAll()
    dataList[index].data.input.forEach(node => {
        if(!noiseMode){
            if(node.cluster!=0) app.map.wrappers.inputMarkerWrapper.addMarker(node)
        }
        else{
            app.map.wrappers.inputMarkerWrapper.addMarker(node)
        }
    })
}
function toggleNoiseMode(){
    if(noiseMode){
        noiseMode = false
    }else{
        noiseMode  = true
    }
    console.log(noiseMode)
}
function realTimeMode(){
    console.log("real mode")
    realMode = true
    draw(dataList[dataList.length-1].data.input)
}
function draw(list){
    app.map.wrappers.inputMarkerWrapper.clearAll()
    list.forEach(node => {
        if(!noiseMode){
            if(node.cluster!=0) app.map.wrappers.inputMarkerWrapper.addMarker(node)
        }
        else{
            app.map.wrappers.inputMarkerWrapper.addMarker(node)
        }
    })
}
function drawDrones(){
    app.map.wrappers.droneMarkerWrapper.clearAll()
    drones.forEach(node => {
        node.gps.lat = Number(node.gps.lat)
        node.gps.lng = Number(node.gps.lng)
        node.gps.al = Number(node.gps.al)
        if(node.gps.lat < 0 || node.gps.lng < 0 || node.gps.al < 0 ){

        }
        else{
            node.position = {lat:node.gps.lat, lng:node.gps.lng}
            var marker = app.map.wrappers.droneMarkerWrapper.addMarker(node)
            app.clearListener(marker, "click")
            app.addListener(marker, "click",function(){
                window.open(`/controllerPage?mac=${node.mac}`,'Controller',"height=500,width=300")
            })
        }
    })
}
function focusDrone(event){
    console.log("focus")
    var index = Number(event.target.id.split("drone")[1])
    var position = {
        lat: app.map.wrappers.droneMarkerWrapper.markers[index].position.lat(),
        lng: app.map.wrappers.droneMarkerWrapper.markers[index].position.lng()
    }
    app.map.setCenter(position)
    console.log(position)
}
function getDrones(){
    console.log("getDrones")
    if(service != undefined){ 
        objectIds = service.drone.list.map(x=>{return x.id})
        $.ajax({
            url : serverURI + serviceMonitorPort + "/getDroneByIds",
            type: "POST",
            data: { objectIds },
            success: function(data, textStatus, jqXHR)
            {
                //data - response from server
                if(data.err != undefined){
                    alert(data.err.message)
                }
                else{
                    drones = data
                    drawDrones()
                    $('#side-table-container2 .table tbody tr').remove()
                    for(var i = 0; i < app.map.wrappers.droneMarkerWrapper.markers.length; i ++){
                        tr = $(`<tr> <td id = "drone${i}"> ${app.map.wrappers.droneMarkerWrapper.markers[i].node.drone.mac} </td></tr>`).appendTo('#side-table-container2 .table tbody')
                        tr.click(function(event){
                            focusDrone(event)
                        })
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                console.log("update error")
            }
        })
    }
}
function reload(){
    console.log("reload")
    $.ajax({

        url : "/update",
        type: "GET",
        success: function(data, textStatus, jqXHR)
        {
            //data - response from server
            if(data.err != undefined){
                alert(data.err.message)
            }
            else{
                if(data.data != undefined){
                    dataList.push(data)
                    tr = $(`<tr> <td> ${dataList.length-1} </td></tr>`).appendTo('#side-table-container .table tbody')
                    tr.click(function(event){
                        realMode = false
                        show(event)
                    })
                    if(realMode){
                        draw(dataList[dataList.length-1].data.input)
                    }
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log("update error")
        }
    })
}
function resetTimer(interval){
    clearInterval(window.timer)
    timer = setInterval(function(){
        reload()
    },interval*1000)
}
function resetGPSTimer(interval){
    clearInterval(window.gpsTimer)
    gpsTimer = setInterval(function(){
        reload()
    },interval*1000)
}
function initRegisterPage(){
    timer = setInterval(function(){
        reload()
    },1000)

    gpsTimer = setInterval(function(){
        getDrones()
    },1000)

    $.ajax({
        url : serverURI + serviceMonitorPort + "/getServiceApplication",
        type: "POST",
        data : {
            serviceId: serviceId
        },
        success: function(data, textStatus, jqXHR)
        {
            if(data.err!=undefined){
                alert(data.err.message)
            }
            else{
                service = data   
                app = new droneMarkerWrapper(new inputMarkerWrapper(new mapEventWrapper(baseMapHandler)))
                app.map.setCenter({
                    lat: (service.bounds.max.lat + service.bounds.min.lat)/2,
                    lng: (service.bounds.max.lng + service.bounds.min.lng)/2
                })
            }           
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            alert("Internal Error")     
        }
    })
}
    