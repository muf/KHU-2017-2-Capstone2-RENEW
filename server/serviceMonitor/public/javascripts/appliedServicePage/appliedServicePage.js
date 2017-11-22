
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
                },
                error: function (jqXHR, textStatus, errorThrown)
                {
                    alert("서비스 등록에 실패하였습니다.")
                }
            });
        }
      })
}