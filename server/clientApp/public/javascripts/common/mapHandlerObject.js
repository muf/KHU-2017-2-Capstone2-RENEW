
var mapHandlerObject = function(){
  // @ attribute
  this.map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.246117, lng: 127.073680},
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: true,
    disableDoubleClickZoom: true
  })

  this.map.wrappers = new Map(); 

  this.showMapElement = function(element){
    element.setMap(this.map)
  }
  this.hideMapElement = function(element){
    element.setMap(this.null)
  }


// key listener for hot keys
window.addEventListener("keypress",function(e){
   console.log("yea")
    if(e.key =='q'||e.key=='Q'){
        map.setZoom(map.getZoom()-1)
    }
    else if(e.key =='w'||e.key=='W'){
        map.setZoom(map.getZoom()+1)
    }
}, map = this.map)

this.util = {
  realLatMeter : function(meter){
      return meter * 0.000008996
  },
  realLngMeter : function(meter){
      return meter * 0.000011335555
  },
  toPyeongArea : function(area){
    return area * 0.3025 
  },
  distanceTo : function(lat1,lon1,lat2,lon2) {
    var deg2rad = this.deg2rad
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in meters
    return d*1000;
  },
  deg2rad : function(deg) {
    return deg * (Math.PI/180)
  }
}
  
}// end
