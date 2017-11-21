
var mapHandlerObject = function(){
  // @ attribute
  this.map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.497908, lng: 127.027619},
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: true,
    disableDoubleClickZoom: true
  })
}
