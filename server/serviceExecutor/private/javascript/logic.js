
var util = {
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

function makeClusterList(rawList){
    rawList = {input: rawList}
    rawList.clusters = new Map()

    rawList.input.forEach(x=>{
        var clusterNumber = x.cluster
        console.log(clusterNumber)
        if(!rawList.clusters.has(clusterNumber)){
            rawList.clusters.set(clusterNumber,[])
            rawList.clusters.get(clusterNumber).bound = {lng:{min:1000, max:-1000}, lat: {min:1000, max:-1000}}
        }
        rawList.clusters.get(clusterNumber).push(x)
        if(x.lat < rawList.clusters.get(clusterNumber).bound.lat.min)   rawList.clusters.get(clusterNumber).bound.lat.min = x.lat
        if(x.lat > rawList.clusters.get(clusterNumber).bound.lat.max)   rawList.clusters.get(clusterNumber).bound.lat.max = x.lat
        if(x.lng < rawList.clusters.get(clusterNumber).bound.lng.min)   rawList.clusters.get(clusterNumber).bound.lng.min = x.lng
        if(x.lng > rawList.clusters.get(clusterNumber).bound.lng.max)   rawList.clusters.get(clusterNumber).bound.lng.max = x.lng
    },rawList)

    return rawList
    
}
function makeGrids(rawList){
    rawList.clusters.forEach(x=>makeGrid(x))
    var gridArray = rawList.clusters.get(0).gridArray;
    printGrid(gridArray)
    return rawList
}
function makeGrid(cluster){
    var meter = 0.00001
    var xTimes = 1000000
    //  x는 위도, y가 경도
    var rX0 =  cluster.bound.lat.min
    var rXM =  cluster.bound.lat.max
    var rY0 =  cluster.bound.lng.min
    var rYM =  cluster.bound.lng.max

    
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
    // allocate
    for (var i = 0; i < cluster.length; i++){
        var Xarr = Math.floor( (XM - (Math.floor(cluster[i].lat * xTimes))) / gridSize)
        var Yarr = Math.floor( ((Math.floor(cluster[i].lng * xTimes) - Y0)) / gridSize)
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


    cluster.gridArray = gridArray
}
function makeGroups(rawList){
    console.log("d")
}
function makeGroup(rawList){
    console.log("d")
}
function printGrid(gridArray){
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



module.exports.util = util
module.exports.makeClusterList = makeClusterList
module.exports.makeGrids = makeGrids
module.exports.makeGrid = makeGrid
module.exports.makeGroups = makeGroups
module.exports.makeGroup = makeGroup