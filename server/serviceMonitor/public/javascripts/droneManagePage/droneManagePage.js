
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

    $('#table-container tbody tr button').click(function(event){
        var id = event.currentTarget.id
        var tr = event.currentTarget.parentElement.parentElement
        var objectId = tr.getElementsByTagName('td')[0].innerHTML
        if( id == "remove-drone"){
            // viewResultPage(event)
            alert(`remove ${objectId}`)
            $.ajax({
                url : "/removeDrone",
                type: "POST",
                data : {objectId},
                success: function(data, textStatus, jqXHR)
                {
                    //data - response from server
                    alert("삭제")
                    location.reload()
                },
                error: function (jqXHR, textStatus, errorThrown)
                {
                    alert("실패")
                    location.reload()
                }
            });

        }
        else{
            return ;
        }
       
      })
}

function addDrone(){
    var mac = $('#drone-mac').val().trim()
    var data={};

    if(mac==""){
        alert("MAC 정보를 입력해주세요")
        return;
    }
    else{
        data.mac = mac
    }

    $.ajax({
        url : "/addDrone",
        type: "POST",
        data : data,
        success: function(data, textStatus, jqXHR)
        {
            //data - response from server
            alert("등록 되었습니다..") 
            location.reload()
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            alert("등록 실패하였습니다..")
            location.reload()
        }
    });
}
