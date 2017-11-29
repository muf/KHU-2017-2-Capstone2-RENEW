
var clusterMarkerWrapper = function(_mapHandler){
    // @ attribute
    _mapHandler.map.wrappers.clusterMarkerWrapper = this
    this.markers = []
    this.addMarker = function(node){
        var marker = _mapHandler.addMarker(this.markers, node.lat, node.lng, {data:node.data, lat:node.lat, lng:node.lng}, node.label, 0)
    }    
    this.clearAll = function(){
        this.markers.forEach(x=> _mapHandler.hideMapElement(x))
        this.markers = []
    }    
    this.toggle = function(){
        //@ 
    }
    return _mapHandler
     
  }// end
  
