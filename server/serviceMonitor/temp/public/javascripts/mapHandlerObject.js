
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
  });

  this.markers = []
  this.markers.drones = []
  this.markers.clusters = new Map()
  this.markers.clusters.size = function(){
    var len = 0
    this.markers.clusters.forEach(function(cluster){
      len += cluster.length
    })
    return len
  }
  this.nextLabel = 0
  this.map.clicked = false

  this.makeMarker = function(lat, lng, drone){

    var drone_icon = '../icon/drone.png'

    var image = {
      url : drone_icon,
      // This marker is 20 pixels wide by 32 pixels high.
      scaledSize : new google.maps.Size(30, 32),
      // The origin for this image is (0, 0).
      origin : new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor : new google.maps.Point(0, 32)
    } // var image
    var title = "[ "
    drone.forEach(function(marker){
      title += marker.label
      title +=", "
    })
    title +=" ]\ndrone : "+drone.length
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat,lng),
      title : title,
      label : ""+drone.group,
      icon : image,
      drone : drone
     
    }) // var marker
    google.maps.event.addListener(marker, "click", function(event) {
      alert(title)
    })
    return marker
  }

  this.nodeToggle = true
  this.toggleNodes = function(){
    if(this.nodeToggle==true){
      this.hideAllNodes()
      this.nodeToggle = false
    }
    else{
      this.showAllNodes()
      this.nodeToggle=true
    }
  }
  this.showAllNodes = function(){
    this.markers.clusters.forEach(function(cluster){
      cluster.forEach(marker => marker.setMap(mapHandler.map))
    },mapHandler=this) 
  }
  this.hideAllNodes = function(){
    this.markers.clusters.forEach(function(cluster){
      cluster.forEach(function(marker){
        console.log(marker.node.group)
        if(marker.node.group >= 0 )  marker.setMap(null)
        else if(marker.node.cluster == 0) marker.setMap(null)
      })
    }) 
  }

  this.droneToggle = true
  this.toggleDrones = function(){
    if(this.droneToggle==true){
      this.showAllDrones()
      this.droneToggle = false
    }
    else{
      this.hideAllDrones()
      this.droneToggle=true
    }
  }
  this.showAllDrones = function(){
    this.markers.drones.forEach(drone=>this.showMapElement(drone.marker))
  }
  this.hideAllDrones = function(){
    this.markers.drones.forEach(drone=>this.hideMapElement(drone.marker))
  }
  // @ method
  this.addMarker = function(lat, lng, node, cluster){
    marker_icon_list = []
    marker_icon_list.push('../icon/01.png')
    marker_icon_list.push('../icon/02.png')
    marker_icon_list.push('../icon/03.png')
    marker_icon_list.push('../icon/04.png')
    marker_icon_list.push('../icon/05.png')

    var image = {
      url : marker_icon_list[cluster],
      // This marker is 20 pixels wide by 32 pixels high.
      scaledSize : new google.maps.Size(30, 32),
      // The origin for this image is (0, 0).
      origin : new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor : new google.maps.Point(0, 32)
    } // var image
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat,lng),
      title : JSON.stringify(node),
      label : ""+this.nextLabel,
      icon : image,
      node : node,
      cluster : cluster
     
    }) // var marker
    this.nextLabel += 1

    google.maps.event.addListener(marker, "click", function(event) {
      alert(JSON.stringify(marker.node))
    })
    // this.markers.push(marker)

    if(!this.markers.clusters.has(cluster)){
      this.markers.clusters.set(cluster,[])
      this.markers.clusters.get(cluster).key = cluster
      this.markers.clusters.get(cluster).bounds={lng:{min:1000, max:-1000}, lat: {min:1000, max:-1000}}
    }
    this.markers.clusters.get(cluster).push(marker)
    if(lat < this.markers.clusters.get(cluster).bounds.lat.min){
      this.markers.clusters.get(cluster).bounds.lat.min = lat
    }
    if(lat > this.markers.clusters.get(cluster).bounds.lat.max){
      this.markers.clusters.get(cluster).bounds.lat.max = lat
    }
    if(lng < this.markers.clusters.get(cluster).bounds.lng.min){
      this.markers.clusters.get(cluster).bounds.lng.min = lng
    }
    if(lng > this.markers.clusters.get(cluster).bounds.lng.max){
      this.markers.clusters.get(cluster).bounds.lng.max = lng
    }
    var bounds = {
        north: this.markers.clusters.get(cluster).bounds.lat.max,
        south: this.markers.clusters.get(cluster).bounds.lat.min,
        east: this.markers.clusters.get(cluster).bounds.lng.max,
        west: this.markers.clusters.get(cluster).bounds.lng.min
    };
    var item = new google.maps.Rectangle({
      bounds: bounds,
      editable: false
    });

    this.markers.clusters.get(cluster).area = item

    google.maps.event.addListener(item, "rightclick", function(event) {
      mapHandler.hideMapElement(item)
    },mapHandler = this);
    google.maps.event.addListener(item, "click", function(event) {
      alert(JSON.stringify(item.bounds))
    });

    this.markers.clusters.get(cluster).getCentroid = function(){
      var latSum = 0
      var lngSum = 0
      var len = this.length
      this.forEach(function(marker){
        latSum += marker.node.lat
        lngSum += marker.node.lng
      })
      return {lat: latSum/len, lng: lngSum/len}
    }

  } // addMarker
  
  this.showAllAreas = function(){
    this.markers.clusters.forEach(cluster=>this.showMapElement(cluster.area))
  }
  this.makeGridArrays = function(){
    this.markers.clusters.forEach(cluster=>this.makeGridArray(cluster))
  }
  this.printGridArrays = function(){
    this.markers.clusters.forEach(cluster=>this.printGridArray(cluster.gridArray))
  }
  this.showMapElement = function(element){
    element.setMap(this.map)
  }
  this.hideMapElement = function(element){
    element.setMap(this.null)
  }
  this.apply = function(){
    // this.showAllAreas()
    this.makeGridArrays()
    this.printGridArrays()
    this.makeGroups(this.markers)
  }
  this.reload = function(map){
    this.markers.clusters.forEach(function(cluster){
      cluster.forEach(marker => marker.setMap(map))
    }) 
  }// reload
  this.emptyMarkers = function(map){
    this.markers.clusters.forEach(function(cluster){
      cluster.forEach(marker => marker.setMap(null))
    }) 
    this.markers = []
  }//emptyMarkers
  // 1번 클러스터로 테스트 진행 @@@
  this.makeGroups = function(markers){
    this.markers.clusters.forEach(function(cluster){
      if(cluster.key != 0)
      groupNodes2(markers.drones, cluster, 4, 10, 50)
    })
  }
// cell 배열을 만들고 노드들을 해당하는 cell에 삽입
  this.makeGridArray = function(cluster){

      var meter = 0.00001
      var xTimes = 1000000
      //  x는 위도, y가 경도
      var rX0 =  cluster.bounds.lat.min
      var rXM =  cluster.bounds.lat.max
      var rY0 =  cluster.bounds.lng.min
      var rYM =  cluster.bounds.lng.max
  
      
      var X0 =  Math.floor(rX0* xTimes)
      var XM =  Math.floor(rXM* xTimes)
      var Y0 =  Math.floor(rY0* xTimes)
      var YM =  Math.floor(rYM* xTimes)
  
      var gridSize = 10 * meter * xTimes; // grid 사이즈는 10미터
  
      var arrXSize =  Math.floor( (XM-X0) / gridSize ) + 1
      var arrYSize =  Math.floor( (YM-Y0) / gridSize ) + 1
  
      var gridArray = []
      // init
      gridArray = new Array(arrXSize); // 매개변수는 배열의 크기
      for (var i = 0; i < arrXSize; i++) {
          gridArray[i] = new Array(arrYSize); // 매개변수는 배열의 크기
          for(var j = 0; j < arrYSize; j++){
              gridArray[i][j] = []
          }
      }
      //console.log("## "+arrXSize+","+arrYSize)
      // allocate
      for (var i = 0; i < cluster.length; i++){
          var Xarr = Math.floor( (XM - (Math.floor(cluster[i].node.lat * xTimes))) / gridSize)
          var Yarr = Math.floor( ((Math.floor(cluster[i].node.lng * xTimes) - Y0)) / gridSize)
          gridArray[Xarr][Yarr].push(cluster[i])
      }
  
      cluster.gridArray = gridArray

      cluster.gridArray.X0 = X0
      cluster.gridArray.XM = XM
      cluster.gridArray.Y0 = Y0
      cluster.gridArray.YM = YM

      cluster.gridArray.gridSize = gridSize
      cluster.gridArray.meter = 0.00001
      cluster.gridArray.xTimes = 1000000
      cluster.gridArray.x = arrXSize
      cluster.gridArray.y = arrYSize

  }

  this.printGridArray = function(gridArray){
    var stringStream = ""
    var total = 0
    for(var i = 0; i < gridArray.x; i++){
        for(var j = 0; j < gridArray.y; j++){
            if(gridArray[i][j].length==0) {
                stringStream += "-"
            }
            else{
                total += gridArray[i][j].length
                stringStream += ( gridArray[i][j].length )
            }
        }
      stringStream += "\n"
    }
    stringStream += "total nodes : "+total;
    console.log(stringStream)
  }
    // 특정 아이템을 컨테이너에서 제거.(map에서도 제거)
  function removeItem(container, item){
    var idx = findItem(container, item)
    container[idx].setMap(null)
    container.splice(idx,1)
  }
  // 특정 컨테이너에서 item의 인덱스를 찾아서 반환
  function findItem(container, item) { 
    for(idx in container){
        if(container[idx] == item){
            return idx
        }
    }
    return -1
  }
  // @ listener
  google.maps.event.addListener(this.map, "rightclick", function(event) {

    if(this.selected == true){
      this.lat2 = event.latLng.lat();
      this.lng2 = event.latLng.lng();
      var distance = distanceTo(this.lat1, this.lng1, this.lat2, this.lng2) * 1000;
      alert("거리 : " + distance + "m")
      this.selected = false;
    }
    else{
      alert("거리 측정!")
      this.lat1 = event.latLng.lat();
      this.lng1 = event.latLng.lng();
      this.selected = true;
    }
  }) 

}
