
var app
var serviceId = location.href.split("serviceId=")[1]
var service
var dataList
var nodeMode = true
var droneMode = true
function toggleDroneMode(){
    if(droneMode){
        droneMode = false
    }else{
        droneMode  = true
    }
    console.log(`droneMode : ${droneMode}`)
}
function toggleNodeMode(flag){
    if(flag){
        nodeMode = flag
    }
    else{
        if(nodeMode){
            nodeMode = false
        }else{
            nodeMode  = true
        }
    }
    console.log(`nodeMode: ${nodeMode}`)
}

function initRegisterPage(){

    $.ajax({
        url : "/getServiceApplication",
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
                app = new droneClusterMarkerWrapper(new clusterMarkerWrapper(new droneMarkerWrapper(new mapEventWrapper(baseMapHandler))))
                app.map.setCenter({
                    lat: (service.bounds.max.lat + service.bounds.min.lat)/2,
                    lng: (service.bounds.max.lng + service.bounds.min.lng)/2
                })
            }   
            
            $.ajax({
                url : "/getBlobData",
                type: "POST",
                data : {
                    path: service.blob.outputBasePath+service.blob.fileName
                },
                success: function(result, textStatus, jqXHR)
                {
                    if(result.err!=undefined){
                        alert(result.err.message)
                    }
                    else{
                        dataList = result
                    }             
                    addTableEvents() 
                },
                error: function (jqXHR, textStatus, errorThrown)
                {
                    alert("Internal Error")     
                }
            })           
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            alert("Internal Error")     
        }
    })
}
function addTableEvents(){

    $('#side-table-container tbody tr').click(function(event){
        var tr = event.currentTarget
        var index = tr.getElementsByTagName('td')[0].innerHTML
        app.map.wrappers.droneMarkerWrapper.clearAll()
        app.map.wrappers.droneClusterMarkerWrapper.clearAll()
        app.map.wrappers.clusterMarkerWrapper.clearAll()

        var drones = dataList[index].drones
        if(droneMode){
            for(var i = 0; i <service.drone.list.length; i++){
                var drone = drones[i]
                app.map.wrappers.droneMarkerWrapper.addMarker(drone)
            }
        }
        if(nodeMode){
            for(var i = 0; i <service.drone.list.length; i++){
                var nodes = drones[i].nodes
                nodes.forEach(node=>{
                    app.map.wrappers.droneClusterMarkerWrapper.addMarker(node)
                })
            }
        }
        else{
            for(i in dataList[index].clusters){
                cluster = dataList[index].clusters[i]
                cluster.forEach(node=>{
                    app.map.wrappers.clusterMarkerWrapper.addMarker(node)
                })
            }
        }
      })
  }
  function objToStrMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}
