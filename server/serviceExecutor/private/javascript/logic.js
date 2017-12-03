var async = require('async')
var request = require('request')
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
        // console.log(clusterNumber)
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
function getGridPos(grid, lat, lng){

    var Xarr = Math.floor( (grid.XM - (Math.floor(lat * grid.xTimes))) / grid.gridSize)
    var Yarr = Math.floor( ((Math.floor(lng* grid.xTimes) - grid.Y0)) / grid.gridSize)
    return {x: Xarr,y: Yarr}
}
function makeGrid(cluster){


    var gridArray = []
    
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

    // init
    gridArray = new Array(arrXSize); // 매개변수는 배열의 크기
    gridArray.meter = meter
    gridArray.xTimes = xTimes
    gridArray.rX0 = rX0
    gridArray.rXM = rXM
    gridArray.rY0 = rY0
    gridArray.rYM = rYM

    gridArray.X0 = X0
    gridArray.XM = XM
    gridArray.Y0 = Y0
    gridArray.YM = YM

    gridArray.gridSize = gridSize
    gridArray.x = arrXSize
    gridArray.y = arrYSize

    for (var i = 0; i < arrXSize; i++) {
        gridArray[i] = new Array(arrYSize); // 매개변수는 배열의 크기
        for(var j = 0; j < arrYSize; j++){
            gridArray[i][j] = []
        }
    }
    // allocate
    
    gridArray.centroid={lat:0,lng:0}

    for (var i = 0; i < cluster.length; i++){
        var Xarr = Math.floor( (XM - (Math.floor(cluster[i].lat * xTimes))) / gridSize)
        var Yarr = Math.floor( ((Math.floor(cluster[i].lng * xTimes) - Y0)) / gridSize)
        gridArray[Xarr][Yarr].push(cluster[i])
        gridArray.centroid.lat += cluster[i].lat
        gridArray.centroid.lng += cluster[i].lng
    }

    gridArray.centroid.lat /= cluster.length
    gridArray.centroid.lng /= cluster.length

    cluster.gridArray = gridArray
    copyList = gridArray.map(row=>{return row.map(elem=>{return elem.map(node=>{return node})})})
    for(item in gridArray){
        if(isNaN(Number(item))){
            copyList[item] = gridArray[item]
        }
    }
    cluster.bufferGridArray = copyList
}
function makeGroups(rawList){
    // 각 클러스터끼리 우선 grouping..
    rawList.drones = []
    rawList.clusters.forEach(x=>makeGroup(x,rawList),rawList)
    return rawList
}
function addDrone(drones){
   drones.push({nodes:[],position: {lat:-1, lng:-1}, gps:{lat:-1, lng:-1}})
}
function makeGroup(cluster, clusters){
    var drones = clusters.drones
    groupNodes2(clusters.drones, cluster,true)
    groupNodes1(clusters.drones, cluster, 5) // 나머지도 커버 시도
    groupNodes1(clusters.drones, cluster, 1) // 나머지도 커버 시도. 나눠서 하는 이유는 추후 드론 댓수에 따른 계산 넣을때 다 커버하고 싶은 경우를 고려.
}
// threshold : 노드 할당이 일정 수 이하 일떄, 드론을 배치할 것인지에 대한 경계 값
// nodeCoverage : 노드 할당 가능 갯수
// apCoverage : 드론이 커버 가능한 직경
// x,y가 하나의 방향으로 끝까지 이동하면서 노드 취급
function groupNodes1(drones, cluster, threshold = 10, nodeCoverage = 10, apCoverage = 100){
    
    var gridArray = cluster.gridArray
    var gridSize = cluster.gridArray.gridSize // 10 미터
    var meter = cluster.gridArray.meter
    var xTimes = cluster.gridArray.xTimes 
    var apCoverage =  apCoverage * meter * xTimes // 100미터
    
    var apCoverageSize = Math.floor(apCoverage / gridSize) // 드론 커버리지 grid 칸 수
    var centerPoint = getGridPos(gridArray,gridArray.centroid.lat, gridArray.centroid.lng)

    for(var exi = 0; exi <  gridArray.x; exi++){
        for(var exj = 0; exj < gridArray.y; exj++){  

            // 하나의 드론 영역 안에서의 작업
            bufferQueue = [];
            for(var ini = exi; ini < exi + apCoverageSize; ini++){
                for(var inj = exj; inj < exj + apCoverageSize; inj++){
                    // 하나의 cell 안에서의 작업
                    // 안에 있는 노드들을 buffer에 하나씩 (큐에) 삽입
                    // 이전에 남아있던 노드 뒤에 하나씩 추가된다
                    if(gridArray[ini]==undefined || gridArray[ini][inj]==undefined){

                    }
                    // 유효한 그리드인 경우 그 안의 마커를 하나씩 버퍼에 저장
                    else{        
                        for(idx in gridArray[ini][inj]){
                            var node = gridArray[ini][inj][idx]
                            node.grid = {x:ini, y:inj,idx:Number(idx)}
                            bufferQueue.push(node)
                        }
                    }
                }
            } // for 하나의 셀 반복문. buffer 삽입
            coreProcess(drones, cluster, bufferQueue, threshold, nodeCoverage)
        }
    }
    // printGrid(gridArray)

    
}
// threshold : 노드 할당이 일정 수 이하 일떄, 드론을 배치할 것인지에 대한 경계 값
// nodeCoverage : 노드 할당 가능 갯수
// apCoverage : 드론이 커버 가능한 직경
// x,y가 중심부로 이동하면서 각 분면별로 처리하는 방식. 남은 것은 하나의 방향으로 전체 커버 시도
// x,y는 중심부 까지 이동하지만 다른 분면의 노드는 건드리지 않는다.
function groupNodes2(drones, cluster, boundary = true, threshold = 10, nodeCoverage = 10, apCoverage = 100){

    var gridArray = cluster.gridArray
    var gridSize = cluster.gridArray.gridSize // 10 미터
    var meter = cluster.gridArray.meter
    var xTimes = cluster.gridArray.xTimes 
    var apCoverage =  apCoverage * meter * xTimes // 100미터
    
    var apCoverageSize = Math.floor(apCoverage / gridSize) // 드론 커버리지 grid 칸 수
    var centerPoint = getGridPos(gridArray,gridArray.centroid.lat, gridArray.centroid.lng)

     // 2사분면
    for(var exi = 0; exi <  centerPoint.x; exi++){
        for(var exj = 0; exj < centerPoint.y; exj++){  

            // 하나의 드론 영역 안에서의 작업
            bufferQueue = [];
            for(var ini = exi; ini < exi + apCoverageSize; ini++){
                for(var inj = exj; inj < exj + apCoverageSize; inj++){
                    // 다른 분면의 노드는 취급하지 않는다.
                    if(boundary){
                        if(ini > apCoverageSize) continue
                        if(inj > apCoverageSize) continue
                    }
                    // 하나의 cell 안에서의 작업
                    // 안에 있는 노드들을 buffer에 하나씩 (큐에) 삽입
                    // 이전에 남아있던 노드 뒤에 하나씩 추가된다
                    if(gridArray[ini]==undefined || gridArray[ini][inj]==undefined){

                    }
                    // 유효한 그리드인 경우 그 안의 마커를 하나씩 버퍼에 저장
                    else{        
                        for(idx in gridArray[ini][inj]){
                            var node = gridArray[ini][inj][idx]
                            node.grid = {x:ini, y:inj,idx:Number(idx)}
                            bufferQueue.push(node)
                        }
                    }
                }
            } // for 하나의 셀 반복문. buffer 삽입
            coreProcess(drones, cluster, bufferQueue, threshold, nodeCoverage)
        }
    }
    printGrid(gridArray)
    // 1사분면
    for(var exi = 0; exi <  centerPoint.x; exi++){
        for(var exj = gridArray.y-1; exj > centerPoint.y; exj--){  

            // 하나의 드론 영역 안에서의 작업
            bufferQueue = [];//exj + apCoverageSize -1
            for(var ini = exi; ini < exi + apCoverageSize; ini++){
                for(var inj = exj ; inj >= exj - apCoverageSize; inj--){
                    // 다른 분면의 노드는 취급하지 않는다.
                    if(boundary){
                        if(ini > apCoverageSize) continue
                        if(inj < apCoverageSize) continue
                    }
                    // 하나의 cell 안에서의 작업
                    // 안에 있는 노드들을 buffer에 하나씩 (큐에) 삽입
                    // 이전에 남아있던 노드 뒤에 하나씩 추가된다
                    if(gridArray[ini]==undefined || gridArray[ini][inj]==undefined){

                    }
                    // 유효한 그리드인 경우 그 안의 마커를 하나씩 버퍼에 저장
                    else{        
                        for(idx in gridArray[ini][inj]){
                            var node = gridArray[ini][inj][idx]
                            node.grid = {x:ini, y:inj,idx:Number(idx)}
                            bufferQueue.push(node)
                        }
                    }
                }
            } // for 하나의 셀 반복문. buffer 삽입
            coreProcess(drones, cluster, bufferQueue, threshold, nodeCoverage)
        }
    }
    printGrid(gridArray)
    // 4사분면
    for(var exi = gridArray.x-1; exi >  centerPoint.x; exi--){
        for(var exj = gridArray.y-1; exj > centerPoint.y; exj--){  

            // 하나의 드론 영역 안에서의 작업
            bufferQueue = [];
            for(var ini = exi; ini >= exi-apCoverageSize; ini--){
                for(var inj = exj; inj >= exj-apCoverageSize; inj--){
                    // 다른 분면의 노드는 취급하지 않는다.
                    if(boundary){
                        if(ini < apCoverageSize) continue
                        if(inj < apCoverageSize) continue
                    }
                    // 하나의 cell 안에서의 작업
                    // 안에 있는 노드들을 buffer에 하나씩 (큐에) 삽입
                    // 이전에 남아있던 노드 뒤에 하나씩 추가된다
                    if(gridArray[ini]==undefined || gridArray[ini][inj]==undefined){

                    }
                    // 유효한 그리드인 경우 그 안의 마커를 하나씩 버퍼에 저장
                    else{        
                        for(idx in gridArray[ini][inj]){
                            var node = gridArray[ini][inj][idx]
                            node.grid = {x:ini, y:inj,idx:Number(idx)}
                            bufferQueue.push(node)
                        }
                    }
                }
            } // for 하나의 셀 반복문. buffer 삽입
            coreProcess(drones, cluster, bufferQueue, threshold, nodeCoverage)
        }
    }
    printGrid(gridArray)
    // 3사분면
    for(var exi = gridArray.x-1; exi >  centerPoint.x; exi--){
        for(var exj = 0; exj < centerPoint.y; exj++){  

            // 하나의 드론 영역 안에서의 작업
            bufferQueue = [];
            for(var ini = exi; ini >= exi-apCoverageSize; ini--){
                for(var inj = exj; inj < exj + apCoverageSize; inj++){
                    // 다른 분면의 노드는 취급하지 않는다.
                    if(boundary){
                        if(ini < apCoverageSize) continue
                        if(inj > apCoverageSize) continue
                    }
                    // 하나의 cell 안에서의 작업
                    // 안에 있는 노드들을 buffer에 하나씩 (큐에) 삽입
                    // 이전에 남아있던 노드 뒤에 하나씩 추가된다
                    if(gridArray[ini]==undefined || gridArray[ini][inj]==undefined){

                    }
                    // 유효한 그리드인 경우 그 안의 마커를 하나씩 버퍼에 저장
                    else{        
                        for(idx in gridArray[ini][inj]){
                            var node = gridArray[ini][inj][idx]
                            node.grid = {x:ini, y:inj,idx:Number(idx)}
                            bufferQueue.push(node)
                        }
                    }
                }
            } // for 하나의 셀 반복문. buffer 삽입
            coreProcess(drones, cluster, bufferQueue, threshold, nodeCoverage)
        }
    }
    printGrid(gridArray)

    
}
function coreProcess(drones, cluster, bufferQueue, threshold, nodeCoverage){
    var gridArray = cluster.gridArray
    while(bufferQueue.length >= threshold){
        addDrone(drones)
       drones[drones.length-1].position = {lat: 0, lng:0} // 배열 뒤에 position 정보 추가
        var latSum = 0
        var lngSum = 0

        var nodesSize = bufferQueue.length
        // 정한 threshold 보다는 많지만, 드론이 최대로 커버할 수 있는 수보다 크다면 node Size는 최대 갯수로 끊고, 아니라면 현재 길이로 한다.
        if(bufferQueue.length > nodeCoverage){
            nodesSize = nodeCoverage
        }
        for(var cni = 0; cni < nodesSize; cni++){ 
            var node = bufferQueue[0] // 맨 앞 item pop
            bufferQueue.splice(0,1) // 맨 앞 제거
            node.group = drones.length-1
            drones[node.group].group = node.group
            drones[node.group].nodes.push(node)
        

            latSum += node.lat
            lngSum += node.lng
            // gridArray에서도 제거
            for(idx in gridArray[ node.grid.x][node.grid.y]){
                if(gridArray[ node.grid.x][node.grid.y][idx] == node){
                    gridArray[ node.grid.x][node.grid.y].splice(idx, 1)
                }
            }
        }
        // 실제 드론 위치 배정. centroid에 배치
        drones[drones.length-1].position.lat = latSum / nodesSize
        drones[drones.length-1].position.lng = lngSum / nodesSize
       // drones[drones.length-1].marker = mapHandler.makeMarker(drones[drones.length-1].position.lat, drones[drones.length-1].position.lng, drones[drones.length-1])
    }
}
function getNodeDensity(clusters, drone){
    var count = 0;
    var dist = 0;
    clusters.clusters.forEach(cluster=>{
        pos = getGridPos(cluster.bufferGridArray, drone.position.lat, drone.position.lng)
        var apCoverage = 100
        var meter = cluster.bufferGridArray.meter
        var xTimes = cluster.bufferGridArray.xTimes
        apCoverage =  apCoverage * meter * xTimes // 100미터
        var apCoverageSize = Math.floor(apCoverage / cluster.bufferGridArray.gridSize) // 드론 커버리지 grid 칸 수

        for(x = pos.x - apCoverageSize/2; x < pos.x + apCoverageSize/2; x ++){
            for(y = pos.y - apCoverageSize/2; y < pos.y + apCoverageSize/2; y++){
                if(cluster.bufferGridArray[x] == undefined || cluster.bufferGridArray[x][y] == undefined){}
                else{
                    count += cluster.bufferGridArray[x][y].length
                    cluster.bufferGridArray[x][y].forEach(node=>{
                        dist += util.distanceTo(node.lat,node.lng, drone.position.lat,drone.position.lng)
                    })
                }
            }
        }
    })
    dist = dist / count
    return {count,dist}
}
function selectingDrones(rawList,callback){
    var drones = rawList.drones
    //TEST@@
    // drones.forEach(x=>{x.weight = Math.random()*100})
    drones.forEach(x=>{
        var assignedNodeWeight = Number(x.nodes.length) * 10000 * 0.8
        var nodeDensityCountWeight = Number(getNodeDensity(rawList, x).count)  * 100 * 0.2 * 0.5
        var nodeDensityDistWeight = (100 - Number(getNodeDensity(rawList, x).dist)) * 0.2 * 0.5
        // console.log("assigneodeWeight:"+assignedNodeWeight)
        // console.log("nodeDensityWeight:"+nodeDensityCountWeight)
        // console.log("nodeDensityWeight:"+nodeDensityDistWeight)ㅇ
        x.weight = Number(assignedNodeWeight + nodeDensityCountWeight + nodeDensityDistWeight)// 0 ~ 100 arctan 그래프 활용하자.
    })
    // ㅋㅋㅋㅋㅋㅋㅋ sort가 비동기였네 
    async.sortBy(drones, function(x, callback) {
        callback(null, x.weight);
    }, function(err,result) {
        // return rawList
        callback(rawList)
    });
    
}
function printGrid(gridArray){
    var centroid = getGridPos(gridArray,gridArray.centroid.lat, gridArray.centroid.lng)
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
            if(i == centroid.x && j == centroid.y){
                stringStream += "c"
            }
        }
      stringStream += "\n"
    }
    stringStream += "total nodes : "+total;
    // console.log(stringStream)
}

function initArray(len, val){
    var list = new Array(len)
    for(i = 0; i < list.length; i++){
        list[i]=val;
    }
    return list
}
function mcmf(jobs, drones){
    var n = drones.length;
    var m = jobs.length
    var vt = initArray(n+m+2, 0)
    var pv = initArray(n+m+2, -1)
    var pe = initArray(n+m+2, -1)
    var worker = 5, job = 5
    
    for(var i = 0; i < drones.length; i++){
        for(var j = 0; i < job.length; i++){
            vt.push({
                v: i,
                cost: -1 * util.distanceTo(jobs[0].position.lat, jobs[0].position.lng, ),
                cap: 1,
                rev: vt.length - 1
            })
        }
    }
    var vt = []; // vector<vector<Edge>>
    var pv = [], pe = []; // vector<int>
    var src = worker + job
    var sink = worker + job + 1
    for(i=0; i<n; i++){
        
    }
/*
5 5
2 1 3 2 2
1 1 5
2 2 1 3 7
3 3 9 4 9 5 9
1 1 0
 */

}
module.exports.mcmf = mcmf
module.exports.util = util
module.exports.makeClusterList = makeClusterList
module.exports.selectingDrones = selectingDrones
module.exports.makeGrids = makeGrids
module.exports.makeGrid = makeGrid
module.exports.makeGroups = makeGroups
module.exports.makeGroup = makeGroup