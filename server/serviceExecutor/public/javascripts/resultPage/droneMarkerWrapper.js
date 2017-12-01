
var droneMarkerWrapper = function(_mapHandler){
    // @ attribute
    _mapHandler.map.wrappers.droneMarkerWrapper = this
    this.markers = []
    this.toggleFlag = true
    this.addMarker = function(drone){
        // console.log(drone)
        var marker = _mapHandler.addMarker(this.markers, drone.position.lat, drone.position.lng, {drone}, '', 0, 'drone')
        return marker
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
  
