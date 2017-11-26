
function addTableEvents(){
    $('#table-container tbody tr').click(function(event){
        var tr = event.currentTarget
        var objectId = tr.getElementsByTagName('td')[0].innerHTML
        var cur = tr.getElementsByTagName('td')[6].innerHTML
        console.log(objectId + ' / ' + cur)
      })

    $('#table-container tbody tr').dblclick(function(event){
        if(confirm("serviceExecutor을 실행하시겠어요?")==true){
        var tr = event.currentTarget
        var objectId = tr.getElementsByTagName('td')[0].innerHTML

          $.ajax({
            url : "/newServiceRequest",
            type: "GET",
            success: function(data, textStatus, jqXHR)
            {
                //data - response from server
                // var pid = data.pid
                // var port = data.port
                // window.open("localhost:"+port,"_blank")
                // alert("실행에 성공하였습니다.(pid: "+pid+", port: "+port+")") 
                alert(data)
                // location.reload(); // 성공 시 다시 로드하여 페이지를 갱신한다.                    
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                alert("실행에 실패하였습니다.")   
                // location.reload(); // 실패 시 다시 로드하여 페이지를 갱신한다.    
            }
          })
        //   $.ajax({
        //     url : "/executeService",
        //     type: "POST",
        //     data:{serviceId:objectId},
        //     headers: {
        //       'Cache-Control': 'no-cache'
        //     },
        //     success: function(data, textStatus, jqXHR)
        //     {
        //         //data - response from server
        //         alert("실행에 성공하였습니다.") 
        //         // location.reload(); // 성공 시 다시 로드하여 페이지를 갱신한다.                    
        //     },
        //     error: function (jqXHR, textStatus, errorThrown)
        //     {
        //         alert("실행에 실패하였습니다.")   
        //         // location.reload(); // 실패 시 다시 로드하여 페이지를 갱신한다.    
        //     }
        // });
        }
      })
}

function convertTimeFormat(form){
  var al = $('#table-container tbody tr')
  for( idx = 0; idx < al.length; idx++){
    for( jdx = 1; jdx <= 3; jdx++){
     al[idx].getElementsByTagName('td')[jdx].innerHTML = new Date(al[idx].getElementsByTagName('td')[jdx].innerHTML).format(form)
   }
  }
}