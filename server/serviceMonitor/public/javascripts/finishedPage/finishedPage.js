
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
      if( id == "view-result"){
          viewResultPage(event)
      }
      else{
          return ;
      }
     
    })
}
function viewResultPage(event){
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
                window.open(`/resultPage?serviceId=${serviceId}`)  
            }              
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            alert("Internal Error")     
        }
    });
}
function convertTimeFormat(form){
  var al = $('#table-container tbody tr')
  for( idx = 0; idx < al.length; idx++){
    for( jdx = 1; jdx <= 3; jdx++){
     al[idx].getElementsByTagName('td')[jdx].innerHTML = new Date(al[idx].getElementsByTagName('td')[jdx].innerHTML).format(form)
   }
  }
}