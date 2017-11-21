/* trigger events */
$('#add-coords').click(function () {
    add_new_coords();
});
$('#apply').click(function () {
    make_table_rows();
});

/* global variable */
var len = 0 
var latlong_regex = /[^1234567890.,]/g;
// 주의 밑에서 이걸로 logic 계산하면 전역 변수라서 전역 변수에 접근한다는 점 주의하자. 
// 예전에 eventmap service 만들때도 그랬음.
function select_menu(id){

}
/* functions */ 
function add_new_coords() {
    var num = len;
    para = $('<input type="text" name="coords" class = "coords" id="co-line' + num + '" >');
    para.appendTo('#side-button-container');
    para = $(' <button id="remove-coords" class="remove-coords  co-line' + num +'">-</button>');
    para.appendTo('#side-button-container');
    $('.co-line' + num).click(function () {
        $('.co-line' + num).remove();
        $('#co-line' + num).remove();
        len --;
    });

    len++;
}
function make_rand_sample(lat, lng, label){
    var rand_num = Math.random(10)*5

    for(var i = label+1; i <= label+rand_num; i ++){
        var rlat_sign = Math.random()*1-0.5 > 0 ? 1 : -1
        var rlng_sign = Math.random()*1-0.5 > 0 ? 1 : -1
        
        var rand_lat = lat + Math.random(100)*100 * 0.000001 * rlat_sign    
        var rand_long = lng + Math.random(100)*100 * 0.000001 * rlng_sign      
        
        add(rand_lat, rand_long,[],i,0);      
        //console.log(rand_lat + ", "+rand_long);  
    }
    reload()
    return label + rand_num
}
function make_table_rows(){
    
    deleteMarkers();
    markers=[];
    var label=0
    $('#side-table-container > table > tbody').empty();
    for(var i = 0; i<len; i++){
        var id = $("#"+($('.coords')[i]).id);
        var text = $(id).val();
        var orignal_text = text;
        text=text.replace(/[(]/g, "{")
        text=text.replace(/[)]/g, "}")
        var coords_temp_list = text.split("{")
        var coords_len = coords_temp_list.length
        start_idx = 1;
        if(coords_len==1){
            start_idx  = 0;
        }
        for(var coords_idx = start_idx; coords_idx<coords_len; coords_idx++){
            var rough_coords = coords_temp_list[coords_idx].split("}")[0].replace(latlong_regex, "").split(",");
            add(parseFloat(rough_coords[0]),parseFloat(rough_coords[1]),[],label,0);

            if(text!=""){
                var num =label;
                
                var refined_coords ='';
                refined_coords+=rough_coords[0]+","+rough_coords[1]
                var para = $('<tr class="tr-line tr-line'+num+'"'+'><td class = "td_num">'+num+'</td><td>'+orignal_text+'</td><td>'+refined_coords+'</td></tr>');
                para.appendTo('#side-table-container > table > tbody');
                $('.tr-line' + num).click(function () {
                    var latlong = $(this)[0].children[2].innerHTML.split(",");
                    map.setCenter({lat: parseFloat(latlong[0]), lng: parseFloat(latlong[1])}); 
                });
                
            }
            
            label=label+1
        }
        
      
    }
    reload();
}

