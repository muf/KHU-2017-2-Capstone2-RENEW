
var inputMarkerWrapper = function(_mapHandler){
    // @ attribute
    _mapHandler.map.wrappers.inputMarkerWrapper = this
    this.markers = []
    this.addMarker = function(node){
        var marker = _mapHandler.addMarker(this.markers, node.lat, node.lng, {data:node.data, lat:node.lat, lng:node.lng}, node.label, node.cluster)
    }    
    this.clearAll = function(){
        this.markers.forEach(x=> _mapHandler.hideMapElement(x))
        this.markers = []
    }    
    return _mapHandler
     
  }// end
  
