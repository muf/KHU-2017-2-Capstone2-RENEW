
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
            }   
            
            $.ajax({
                url : "/getBlobData",
                type: "POST",
                data : {
                    // @@
                    path: service.blob.inputBasePath+service.blob.fileName
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
    app = new outputMarkerWrapper(new mapEventWrapper(baseMapHandler))

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
        app.map.wrappers.outputMarkerWrapper.clearAll()
        dataList[index].forEach( x => {
            app.map.wrappers.outputMarkerWrapper.addMarker(x)
        })
      })
  }
