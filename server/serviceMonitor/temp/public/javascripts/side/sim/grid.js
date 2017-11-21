
// // cell 배열을 만들고 노드들을 해당하는 cell에 삽입
// function makeGridArray(){
    
//         if(rec_areas.length==0){
//             return ;
//         } 
//         var meter = 0.00001
//         var xTimes = 1000000
    
//         rX0 =  rec_areas[0].getBounds().b.b
//         rXM =  rec_areas[0].getBounds().b.f
//         rY0 =  rec_areas[0].getBounds().f.b
//         rYM =  rec_areas[0].getBounds().f.f
    
        
//         X0 =  Math.floor(rec_areas[0].getBounds().b.b * xTimes)
//         XM =  Math.floor(rec_areas[0].getBounds().b.f * xTimes)
//         Y0 =  Math.floor(rec_areas[0].getBounds().f.b * xTimes)
//         YM =  Math.floor(rec_areas[0].getBounds().f.f * xTimes)
    
//         gridSize = 10 * meter * xTimes;
    
//         arrXSize =  Math.floor( (YM-Y0) / gridSize ) + 1
//         arrYSize =  Math.floor( (XM-X0) / gridSize ) + 1
    
//         gridArray = []
//         // init
//         gridArray = new Array(arrXSize); // 매개변수는 배열의 크기
//         for (var i = 0; i < arrXSize; i++) {
//             gridArray[i] = new Array(arrYSize); // 매개변수는 배열의 크기
//             for(var j = 0; j < arrYSize; j++){
//                 gridArray[i][j] = []
//             }
//         }
//         // allocate
//         for (var i = 0; i < g_filteredNodes.length; i++){
//             var Yarr = Math.floor((Math.floor(g_filteredNodes[i].lng * xTimes) - X0) / gridSize) + 1
//             var Xarr = arrXSize - Math.floor((Math.floor(g_filteredNodes[i].lat * xTimes) - Y0) / gridSize) -1
//             // console.log("X:"+Xarr+" / Y: "+Yarr + " / label : "+g_filteredNodes[i].cluster_number)
//             gridArray[Xarr][Yarr].push(g_filteredNodes[i])
//         }
    
//         printGrid()
    
//     }






// var toggle_screen_flag = false
// var toggle_result_screen_flag = false

// function deleteMapDrones(){
//     for(idx in map_drones){
//         map_drones[idx].setMap(null)
//     }
//     map_drones = []
// }

// function makeMapDrones(){
//     deleteMapDrones()
//     for(idx in rec_drones){
//         var bounds =  rec_drones[idx].bounds
//         var point = {lng: (bounds.b.f+bounds.b.b)/2, lat : (bounds.f.f + bounds.f.b)/2}
//         var drone = new google.maps.Marker({
//             position: new google.maps.LatLng(point.lat, point.lng),
//             label:""+idx
//         });
//         map_drones.push(drone)
//     }
// }

// function draw_result(){
//     makeMapDrones()
//     if(toggle_result_screen_flag == true){
//         for(idx in map_drones){
//             map_drones[idx].setMap(null)
//         }
//         toggle_result_screen_flag = false

//     }
//     else{
//         for(idx in map_drones){
//             map_drones[idx].setMap(map)
//         }
//         toggle_result_screen_flag = true
//     }
// }

// function toggle_screen(){
//     if(toggle_screen_flag==true){
        
//         for(idx in rec_drones){
//             rec_drones[idx].setMap(map)
//         }
//         for(idx in markers){
//             markers[idx].setMap(map)    
//         }
//         toggle_screen_flag = false
//     }
//     else{
//         for(idx in rec_drones){
//             rec_drones[idx].setMap(null)
//         }
        
//         for(idx in markers){
//             if(markers[idx].node.handle_number != -1){
//                 markers[idx].setMap(null)
//             }
//         }
//         toggle_screen_flag = true
//     }
// }

// function getXY(lat, lng){
//         var Yarr = Math.floor((Math.floor(lng * xTimes) - X0) / gridSize) + 1
//         var Xarr = arrXSize - Math.floor((Math.floor(lat * xTimes) - Y0) / gridSize) -1
//         return {x:Xarr,y:Yarr}
// }

// // 서비스 제공 영역 제공. auto 입력시 여의도에 지정된 영역으로 설정

// // cell 배열 출력
// function printGrid(){
//     var stringStream = ""
//     var total = 0
//     for(var i = 0; i < arrXSize; i++){
//         for(var j = 0; j < arrYSize; j++){
//             if(gridArray[i][j]=="center"){
//                   stringStream+="C"
//             }
//             else  if(gridArray[i][j].length==0) {
//                 stringStream += "-"
//             }
//             else{
//                 total += gridArray[i][j].length
//                 stringStream += ( gridArray[i][j].length )
//             }
//         }
//     stringStream += "\n"
//     }
//     stringStream += "total nodes : "+total;
//     console.log(stringStream)
//     alert(stringStream)
// }
// function deleteDrones(){
//     deleteRectangles(rec_drones)
// }
// function deleteCells(){
//     deleteRectangles(rec_cells)
// }
// function deleteAreas(){
//     deleteRectangles(rec_areas)
// }

// function drawDrones(drone){
    
//     var lng = drone.position.lng
//     var lat = drone.position.lat
//     var meter = 0.00001
//     var width = apCoverage/ xTimes / 2
//     var bounds = {
//         north: lat + width,
//         south: lat - width,
//         east: lng + width,
//         west: lng - width
//     };
//     drone.bounds = bounds
//     drawRectangle(rec_drones, bounds)
// }

// function addCell(i,j){
//     var lng = rX0+j*0.00001 * 10 
//     var lat = rY0+i*0.00001 * 10
//     var meter = 0.00001
//     var width = meter * 10
//     var bounds = {
//         north: lat + width,
//         south: lat,
//         east: lng + width,
//         west: lng
//     };
//     drawRectangle(rec_cells, bounds)
// }
// function addServiceArea( auto=true){
//     var lat = map.center.lat()
//     var lng = map.center.lng()
//     var meter = 0.00001
//     var bounds 
//     if(auto == true){
//         bounds = {
//             north: 37.5294352615257,
//             south: 37.52559357117715,
//             east: 126.92895349805713,
//             west: 126.92169392392998
//           };
//     }
//     else{
//         bounds = {
//             north: lat + meter * 10,
//             south: lat - meter * 10,
//             east: lng + meter * 10,
//             west: lng - meter * 10
//           };
//     }

//     drawRectangle(rec_areas, bounds)
// }

// function addCells(){
//     for(var i = 0; i < arrXSize; i++){
//         for(var j = 0; j < arrYSize; j++){
//             addCell(i,j)
//         }
//     }
// }

// function drawRectangle(container, bounds){
//     // Define a rectangle and set its editable property to true.
//     console.log("draw Rectangle..")
//     var item = new google.maps.Rectangle({
//         bounds: bounds,
//         editable: false
//     });
//     item.setMap(map);

//     container.push(item)
//     google.maps.event.addListener(item, "rightclick", function(event) {
//         deleteRectangle(container, item)
//     });
//     google.maps.event.addListener(item, "click", function(event) {
//         console.log("container : ")
//         console.log(container)
//         console.log("item : ")
//         console.log(item)
//     });
// }
// function deleteRectangle(container, item){
//     var idx = findRectangle(container, item)
//     container[idx].setMap(null)
//     container.splice(idx,1)
// }

// function deleteRectangles(container){
//     var copy_container = Object.assign({}, container)
//     for(idx in copy_container){
//         deleteRectangle(container, copy_container[idx])
//     }
//     container = []
// }
// function findRectangle(container, item) { 
//     for(idx in container){
//         if(container[idx] == item){
//             return idx
//         }
//     }
//     return -1
// }
