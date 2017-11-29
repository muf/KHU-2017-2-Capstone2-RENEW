
var droneMarkerWrapper = function(_mapHandler){
    // @ attribute
    _mapHandler.map.wrappers.droneMarkerWrapper = this
    this.markers = []
    this.addMarker = function(drone){
        // console.log(drone)
        var marker = _mapHandler.addMarker(this.markers, drone.position.lat, drone.position.lng, {drone}, drone.group, 0, 'drone')
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
  
