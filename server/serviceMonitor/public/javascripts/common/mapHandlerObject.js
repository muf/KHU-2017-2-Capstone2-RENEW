
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

  this.map.wrappers = {}

  this.addMarker = function(markers, lat,long,_list,label,i,type='default'){
    marker_icon_list = []
    marker_icon_list.push('../../icon/01.png')
    marker_icon_list.push('../../icon/02.png')
    marker_icon_list.push('../../icon/03.png')
    marker_icon_list.push('../../icon/04.png')
    marker_icon_list.push('../../icon/05.png')
    marker_icon_list.push('../../icon/06.png')
    var marker_icon
    if(type =='default'){
      marker_icon = marker_icon_list[5]
    }
    else if(type == 'drone'){
      marker_icon = '../../icon/drone.png'
    }
    var image = {
      // url:marker_icon,
      // This marker is 20 pixels wide by 32 pixels high.
      scaledSize: new google.maps.Size(20, 32),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(0, 32),
      fillColor: '#4286f4'
    };

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat,long),
      label:""+label,
      icon : image,
      node : _list
    })

    google.maps.event.addListener(marker, "click", function(event) {
      alert(JSON.stringify(marker.node))
      //console.log(marker.title).
    });
    
    markers.push(marker)
    this.showMapElement(marker)
    console.log(marker)
    return marker
  }
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
