

function get_help(){

    alert(" key s/S : toggle side menu \n key q/Q show map wider \n key w/W show map closer \n Left Click : get distance between two locations left clicked  \n Click Marker : Show detail information")
}


var scroll_position=$('body').scrollTop(); // Mac List scroll position will be saved for come back
window.scrollTo(0,0)

toggle_visibility_s = true;
toggle_visibility_a = false;

var saveWidth
// toggle side menu
function toggle_menu(key){
    if(key=='s'){
        if(toggle_visibility_s==true){
            scroll_position =$('body').scrollTop();

            $('#map').css('z-index',0);
            google.maps.event.trigger(map, 'resize');
            
            $('#side-container').css('width','0%');
            $('#side-container').toggle(); 

            toggle_visibility_s=false;      
        }
        else{ 
            console.log(scroll_position);
            $('#map').css('z-index',-1);
            google.maps.event.trigger(map, 'resize');

            $('#side-container').css('width','');
            $('#side-container').toggle();
            toggle_visibility_s=true;
        }
    }
    
    $('#side-container').css('z-index','33');
    $('#result-side-container').css('z-index','35');
}

// key listener for hot keys
window.addEventListener("keypress",function(e){
    // if focused element is not a input type ? -> toggle menu with 's' or 'S' key
    if($("input:focus").length==0){
        if(e.key =='s'||e.key=='S'){
            toggle_menu('s')
        }
        if(e.key =='a'||e.key=='A'){
            toggle_menu('a')
        }
        else if(e.key =='q'||e.key=='Q'){
            mapHandler.map.setZoom(mapHandler.map.getZoom()-2)
        }
        else if(e.key =='w'||e.key=='W'){
            mapHandler.map.setZoom(mapHandler.map.getZoom()+2)
        }
    }

})

