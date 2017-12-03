
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

  this.map.wrappers = {}

  this.addMarker = function(markers, lat,long,_list,label,i,type='default'){
    var hexMax = 16777215
    marker_icon_list = []
    marker_icon_list.push('../../icon/01.png')
    marker_icon_list.push('../../icon/02.png')
    marker_icon_list.push('../../icon/03.png')
    marker_icon_list.push('../../icon/04.png')
    marker_icon_list.push('../../icon/05.png')
    marker_icon_list.push('../../icon/06.png')
    var marker_icon
    if(type =='default'){
      var color = "#"+ Number((123456789 + 123456789*i) % hexMax).toString(16)
      marker_icon = {
        //http://jsfiddle.net/upsidown/eLcNq/
          // path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
          path: 'M8 2.1c1.1 0 2.2 0.5 3 1.3 0.8 0.9 1.3 1.9 1.3 3.1s-0.5 2.5-1.3 3.3l-3 3.1-3-3.1c-0.8-0.8-1.3-2-1.3-3.3 0-1.2 0.4-2.2 1.3-3.1 0.8-0.8 1.9-1.3 3-1.3z',
          fillColor: color,
          fillOpacity: .99,
          strokeWeight: 0,
          scale:3,
          labelOrigin: new google.maps.Point(8,8)
      }
    }
    else if(type == 'drone'){
      marker_icon = {
        url: '../../icon/drone.png',
        //This marker is 20 pixels wide by 32 pixels high.
        scaledSize: new google.maps.Size(32, 32)
      };
    }
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat,long),
      label:""+label,
      icon : marker_icon,
      node : _list
    })

    google.maps.event.addListener(marker, "click", function(event) {
      alert(JSON.stringify(marker.node))
      //console.log(marker.title).
    });
    
    markers.push(marker)
    this.showMapElement(marker)
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
