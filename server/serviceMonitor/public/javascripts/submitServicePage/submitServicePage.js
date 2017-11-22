
function addTableEvents(){
    $('#table-container tbody tr').click(function(event){
        var tr = event.currentTarget
        var objectId = tr.getElementsByTagName('td')[0].innerHTML
        var cur = tr.getElementsByTagName('td')[6].innerHTML
        console.log(objectId + ' / ' + cur)
      })


    $('#table-container tbody tr').dblclick(function(event){
        if(confirm("안녕하십니까?")==true){

        }
      })
}