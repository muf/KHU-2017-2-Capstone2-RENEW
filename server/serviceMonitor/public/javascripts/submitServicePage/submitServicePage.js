
function addTableEvents(){
    $('#table-container tbody tr').click(function(event){
        var tr = event.currentTarget
        var objectId = tr.getElementsByTagName('td')[0].innerHTML
        var cur = tr.getElementsByTagName('td')[6].innerHTML
        console.log(objectId + ' / ' + cur)
      })


    $('#table-container tbody tr').dblclick(function(event){
        if(confirm("안녕하십니d까?")==true){

          location.reload(); // @@@ 심심하니까 다시 갱신 ㅎㅎ
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