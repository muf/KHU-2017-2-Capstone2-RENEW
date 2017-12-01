
var app
var serviceId = location.href.split("serviceId=")[1]
var service
var dataList
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
                    // @@
                    path: service.blob.outputBasePath+service.blob.fileName
                },
                success: function(result, textStatus, jqXHR)
                {
                    if(result.err!=undefined){
                        alert(result.err.message)
                    }
                    else{
                        dataList = result
                        // dataList.forEach(x=> x.clusters = objToStrMap(x.clusters))
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
function applyInputData(){
    input = []
    data = []
    app.map.wrappers.inputMarkerWrapper.markers.forEach(function(elem){
        elem.node.label = elem.label
        data.push(elem.node)
    },data)

    start = new Date(service.serviceStartDate)
    end = new Date(service.serviceEndDate)
    var diff = end.getTime() - start.getTime()
    var minutes = diff / 60000 // 1분 마다 갱신되는 데이터 형태
    for(var i = 0; i < minutes; i ++){
        var newDate = 
            data.map(function(node){
                var newNode = app.map.wrappers.inputMarkerWrapper.moveNode(node) 
                newNode.label = node.label
                return newNode
            })
        input.push(newDate)
    }
    console.log("finin")

    $.ajax({
        url : "/saveInputBlob",
        type: "POST",
        data : {
            input:JSON.stringify(input),
            serviceId: service._id
        },
        headers: {
           'Cache-Control': 'no-cache'
        },
        //contentType:"application/jsonrequest",
        success: function(data, textStatus, jqXHR)
        {
            if(data.err!=undefined){
                alert(data.err.message)
            }
            else{
                alert("저장 성공")
            }              
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

        
        for(i in dataList[index].clusters){
            cluster = dataList[index].clusters[i]
            cluster.forEach(node=>{
                app.map.wrappers.clusterMarkerWrapper.addMarker(node)
            })
        }

        var drones = dataList[index].drones
        for(var i = 0; i <service.drone.list.length; i++){
            var drone = drones[i]
            app.map.wrappers.droneMarkerWrapper.addMarker(drone)
        }
        dataList[index].drones.forEach(drone=>{
            drone.nodes.forEach(node=>{
                app.map.wrappers.droneClusterMarkerWrapper.addMarker(node)
            })
        })

      })
  }
  function objToStrMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}
