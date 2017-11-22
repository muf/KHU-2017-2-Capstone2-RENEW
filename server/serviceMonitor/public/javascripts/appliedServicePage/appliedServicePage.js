
function addTableEvents(){
    $('#table-container tbody tr').click(function(event){
        var tr = event.currentTarget
        var objectId = tr.getElementsByTagName('td')[0].innerHTML
        var cur = tr.getElementsByTagName('td')[6].innerHTML
        console.log(objectId + ' / ' + cur)
      })


    $('#table-container tbody tr').dblclick(function(event){
        if(confirm("서비스를 수락하시겠습니까?")==true){
            var tr = event.currentTarget
            var objectId = tr.getElementsByTagName('td')[0].innerHTML
            var state = "submit"
            $.ajax({
                url : "/updateServiceApplicationState",
                type: "POST",
                data : {
                    objectId: objectId,
                    state: state
                },
                success: function(data, textStatus, jqXHR)
                {
                    //data - response from server
                    alert("서비스 등록에 성공하였습니다.") 
                    location.reload(); // 성공 시 다시 로드하여 페이지를 갱신한다.                    
                },
                error: function (jqXHR, textStatus, errorThrown)
                {
                    alert("서비스 등록에 실패하였습니다.")   
                    location.reload(); // 실패 시 다시 로드하여 페이지를 갱신한다.    
                }
            });
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