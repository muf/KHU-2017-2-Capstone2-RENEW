var mapHandler

function initMap(){
    baseMapHandler = new mapHandlerObject()
    app = new mapEventWrapper(baseMapHandler)
  
    // mapHandler.addMarker(
    //   triggeredLat, 
    //   triggeredLng,
    //   {lat : triggeredLat, lng : triggeredLng},
    //   0)
    // mapHandler.reload(mapHandler.map)

}

  