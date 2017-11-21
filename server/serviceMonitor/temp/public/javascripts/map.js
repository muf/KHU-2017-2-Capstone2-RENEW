var dependencies =[
  "mapHandlerObject.js"
]
dependencies.forEach(function(dependency){ 
  console.log("dependency: " + dependency)
  $.getScript('/javascripts/' + dependency, function(){ console.log(dependency+' is loaded') })
})

var mapHandler; 

function initMap(){
    mapHandler = new mapHandlerObject()

    google.maps.event.addListener(mapHandler.map, "dblclick", function(event) {
      alert("db")
      var triggeredLat = event.latLng.lat()
      var triggeredLng = event.latLng.lng()
  
      mapHandler.addMarker(
        triggeredLat, 
        triggeredLng,
        {lat : triggeredLat, lng : triggeredLng},
        0)
      mapHandler.reload(mapHandler.map)

    });  
}

function distanceTo(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in kms
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

