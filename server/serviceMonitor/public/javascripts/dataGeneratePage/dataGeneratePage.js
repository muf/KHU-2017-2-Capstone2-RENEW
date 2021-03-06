var app
var serviceId = location.href.split("serviceId=")[1]
var service
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
                app = new inputMarkerWrapper(new mapEventWrapper(baseMapHandler))
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
    var minutes = diff / 1000 // 1분 마다 갱신되는 데이터 형태 -> 3초로 임시 변경
    for(var i = 0; i < minutes+1; i ++){
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
    

