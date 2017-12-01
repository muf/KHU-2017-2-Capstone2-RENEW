
var clusterMarkerWrapper = function(_mapHandler){
    // @ attribute
    _mapHandler.map.wrappers.clusterMarkerWrapper = this
    this.markers = []
    this.toggleFlag = true
    this.addMarker = function(node){
        var marker = _mapHandler.addMarker(this.markers, node.lat, node.lng, {data:node.data, lat:node.lat, lng:node.lng}, node.label, node.cluster)
    }    
    this.clearAll = function(){
        this.markers.forEach(x=> _mapHandler.hideMapElement(x))
        this.markers = []
    }    
    this.toggle = function(){
        //@ 
        if(this.toggleFlag){
            this.markers.forEach(x=> _mapHandler.hideMapElement(x))
            this.toggleFlag = false
        }else{
            this.markers.forEach(x=> _mapHandler.showMapElement(x))
            this.toggleFlag = true
        }
    }
    return _mapHandler
     
  }// end
  
