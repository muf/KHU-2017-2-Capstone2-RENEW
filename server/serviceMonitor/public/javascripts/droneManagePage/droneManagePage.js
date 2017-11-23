
function addTableEvents(){
    $('#table-container tbody tr').click(function(event){
        var tr = event.currentTarget
        var objectId = tr.getElementsByTagName('td')[0].innerHTML
        var cur = tr.getElementsByTagName('td')[6].innerHTML
        console.log(objectId + ' / ' + cur)
      })


    $('#table-container tbody tr').dblclick(function(event){
        if(confirm("안녕하십니까?")==true){
            alert("하이~")
        }
      })
}

function addDrone(){
    var ip = $('#drone-ip').val()
    var port = $('#drone-port').val()
    var model = $('#drone-model').val()
    var state = $('#drone-state').val()
    var data;

    if(ip!="") data.ip = ip;
    if(port!="") data.port = port;
    if(model!="") data.model = model;
    if(state!="") data.state = state;

    $.ajax({
        url : "/addDrone",
        type: "POST",
        data : data,
        success: function(data, textStatus, jqXHR)
        {
            //data - response from server
            alert("등록 되었습니다..") // db query 날리고 성공하면 접수 ㅇㅋ 하고 종료... 서비스 관리 및 로그인? 이런 건 안 할 예정 
            location.reload()
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            alert("등록 실패하였습니다..")
            location.reload()
        }
    });
}
