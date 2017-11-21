
function getNodeInfo(){
    console.log("getTest()")
    $.ajax({
    type: 'GET',     
    url: '/getNodeInfo',
    dataType:'json',
    success: function (result) {
        initMap()
        var node_info_list = result; //  get clustered csv data
        
        node_info_list.forEach(function(item){
            var node = {
                lat : item.lat, 
                lng : item.lng,  
                cluster : item.cluster,
                group : -1}

            mapHandler.addMarker(item.lat, item.lng, node, node.cluster)
        }) // node_info_list forEach
        
        mapHandler.reload(mapHandler.map)
        mapHandler.map.setCenter({lat: node_info_list[0].lat, lng: node_info_list[0].lng})
    },
    fail:function (result) {
        alert("ERROR : simulator.js \n FUNCTION : getNodeInfo() ");
    }
});
}