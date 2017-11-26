
function addTableEvents(){
  $('#table-container tbody tr').dblclick(function(event){
 
  })
  $('#table-container tbody tr').click(function(event){
      var tr = event.currentTarget
      var serviceId = tr.getElementsByTagName('td')[0].innerHTML
      $.ajax({
          url : "/getServiceApplication",
          type: "POST",
          data : {
              serviceId: serviceId
          },
          success: function(data, textStatus, jqXHR)
          {
              console.log(JSON.stringify(data))                  
          },
          error: function (jqXHR, textStatus, errorThrown)
          {
              console.log("error: " + errorThrown)     
          }
      });
    })


  $('#table-container tbody tr button').click(function(event){
      var id = event.currentTarget.id
      if( id == "make-data"){
          makeDataAction(event)
      }else if(id == "execute"){
        executeAction(event)
      }else if(id == "view"){
        viewAction(event)
      }
      
      else{
          return ;
      }
     
    })
}
function viewAction(event){
    var tr = event.currentTarget.parentElement.parentElement
    var port = tr.getElementsByTagName('td')[8].innerHTML
    window.open(`localhost://${port}`,'_blank')  
}

function makeDataAction(event){
    var tr = event.currentTarget.parentElement.parentElement
    var objectId = tr.getElementsByTagName('td')[0].innerHTML
    $.ajax({
        url : "/getServiceApplication",
        type: "POST",
        data : {
            serviceId: objectId
        },
        success: function(data, textStatus, jqXHR)
        {
            if(data.err!=undefined){
                alert(data.err.message)
            }
            else{
                var serviceId = data._id
                window.open(`/dataGeneratePage?serviceId=${serviceId}`)  
            }              
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            alert("Internal Error")     
        }
    });
}
function executeAction(event){
    if(confirm("서비스를 실행하시겠습니까?")==true){
        var tr = event.currentTarget.parentElement.parentElement
        var objectId = tr.getElementsByTagName('td')[0].innerHTML
        $.ajax({
            url : "/executeService",
            type: "POST",
            data : {
                serviceId: objectId
            },
            success: function(data, textStatus, jqXHR)
            {

                if(data.err!=undefined){
                    alert(data.err.message)
                    location.reload(); // 성공 시 다시 로드하여 페이지를 갱신한다.  
                }
                else{
                    alert("서비스 실행에 성공하였습니다.") 
                    var port = data.port
                    alert(port)
                    location.reload(); // 성공 시 다시 로드하여 페이지를 갱신한다.  
                }              
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                alert("서비스 실행에 실패하였습니다.")   
                location.reload(); // 실패 시 다시 로드하여 페이지를 갱신한다.    
            }
        });
    }
}

function convertTimeFormat(form){
  var al = $('#table-container tbody tr')
  for( idx = 0; idx < al.length; idx++){
    for( jdx = 1; jdx <= 3; jdx++){
     al[idx].getElementsByTagName('td')[jdx].innerHTML = new Date(al[idx].getElementsByTagName('td')[jdx].innerHTML).format(form)
   }
  }
}