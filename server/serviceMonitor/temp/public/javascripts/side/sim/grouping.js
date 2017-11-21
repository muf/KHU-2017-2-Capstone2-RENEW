


function getXY(position, cluster){
    var lat = position.lat
    var lng = position.lng
    var XM = cluster.gridArray.XM
    var Y0 = cluster.gridArray.Y0
    var gridSize = cluster.gridArray.gridSize
    var xTimes = cluster.gridArray.xTimes

    var Xarr = Math.floor( (XM - (Math.floor(lat * xTimes))) / gridSize)
    var Yarr = Math.floor( ((Math.floor(lng * xTimes) - Y0)) / gridSize)
    console.log(Xarr+"/"+Yarr)
    return { x: Xarr, y: Yarr }
}

function coreProcess(drones, cluster, bufferQueue, threshold, nodeCoverage ){
    var gridArray = cluster.gridArray
    while(bufferQueue.length >= threshold){
        drones.push([]) // 새로운 드론 할당
        drones[drones.length-1].position = {lat: 0, lng:0} // 배열 뒤에 position 정보 추가
        var latSum = 0
        var lngSum = 0

        var nodesSize = bufferQueue.length
        // 정한 threshold 보다는 많지만, 드론이 최대로 커버할 수 있는 수보다 크다면 node Size는 최대 갯수로 끊고, 아니라면 현재 길이로 한다.
        if(bufferQueue.length > nodeCoverage){
            nodesSize = nodeCoverage
        }
        for(var cni = 0; cni < nodesSize; cni++){ 
            var marker = bufferQueue[0] // 맨 앞 item pop
            bufferQueue.splice(0,1) // 맨 앞 제거
            marker.node.group = drones.length-1
            drones[marker.node.group].group = marker.node.group
            drones[marker.node.group].push(marker)
            

            latSum += marker.node.lat
            lngSum += marker.node.lng
            // gridArray에서도 제거
            for(idx in gridArray[ marker.node.x][marker.node.y]){
                if(gridArray[ marker.node.x][marker.node.y][idx] == marker){
                    gridArray[ marker.node.x][marker.node.y].splice(idx, 1)
                }
            }
        }
        // 실제 드론 위치 배정. centroid에 배치
        drones[drones.length-1].position.lat = latSum / nodesSize
        drones[drones.length-1].position.lng = lngSum / nodesSize
        drones[drones.length-1].marker = mapHandler.makeMarker(drones[drones.length-1].position.lat, drones[drones.length-1].position.lng, drones[drones.length-1])


    }
}
// 4사분면으로 나누어서 중심 방향으로 진행
function groupNodes2(drones, cluster, threshold = 10, nodeCoverage = 10, apCoverage = 100){
    var cluster_numver = cluster.key
    var gridArray = cluster.gridArray
    var gridSize = cluster.gridArray.gridSize // 10 미터
    var meter = cluster.gridArray.meter
    var xTimes = cluster.gridArray.xTimes 
    var apCoverage =  apCoverage * meter * xTimes // 100미터
    
    var apCoverageSize = Math.floor(apCoverage / gridSize) // 드론 커버리지 grid 칸 수
    var centerPoint = getXY(cluster.getCentroid(),cluster)


    console.log("cluster : "+cluster.key)

     // 2사분면
    for(var exi = 0; exi <  centerPoint.x; exi++){
        for(var exj = 0; exj < centerPoint.y; exj++){  

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
                            var marker = gridArray[ini][inj][idx]
                            marker.node.x = ini
                            marker.node.y = inj
                            marker.node.idx = idx
                            bufferQueue.push(marker)
                        }
                    }
                }
            } // for 하나의 셀 반복문. buffer 삽입
            coreProcess(drones, cluster, bufferQueue, threshold, nodeCoverage)
        }
    }
    // 1사분면
    for(var exi = 0; exi <  centerPoint.x; exi++){
        for(var exj = gridArray.y-1; exj > centerPoint.y; exj--){  

            // 하나의 드론 영역 안에서의 작업
            bufferQueue = [];
            for(var ini = exi; ini < exi + apCoverageSize; ini++){
                for(var inj = exj + apCoverageSize -1 ; inj >= exj; inj--){
                    // 하나의 cell 안에서의 작업
                    // 안에 있는 노드들을 buffer에 하나씩 (큐에) 삽입
                    // 이전에 남아있던 노드 뒤에 하나씩 추가된다
                    if(gridArray[ini]==undefined || gridArray[ini][inj]==undefined){

                    }
                    // 유효한 그리드인 경우 그 안의 마커를 하나씩 버퍼에 저장
                    else{        
                        for(idx in gridArray[ini][inj]){
                            var marker = gridArray[ini][inj][idx]
                            marker.node.x = ini
                            marker.node.y = inj
                            marker.node.idx = idx
                            bufferQueue.push(marker)
                        }
                    }
                }
            } // for 하나의 셀 반복문. buffer 삽입
            coreProcess(drones, cluster, bufferQueue, threshold, nodeCoverage)
        }
    }
    // 4사분면
    for(var exi = gridArray.x-1; exi >  centerPoint.x; exi--){
        for(var exj = gridArray.y-1; exj > centerPoint.y; exj--){  

            // 하나의 드론 영역 안에서의 작업
            bufferQueue = [];
            for(var ini = exi + apCoverageSize - 1; ini >= exi; ini--){
                for(var inj = exj + apCoverageSize -1 ; inj >= exj; inj--){
                    // 하나의 cell 안에서의 작업
                    // 안에 있는 노드들을 buffer에 하나씩 (큐에) 삽입
                    // 이전에 남아있던 노드 뒤에 하나씩 추가된다
                    if(gridArray[ini]==undefined || gridArray[ini][inj]==undefined){

                    }
                    // 유효한 그리드인 경우 그 안의 마커를 하나씩 버퍼에 저장
                    else{        
                        for(idx in gridArray[ini][inj]){
                            var marker = gridArray[ini][inj][idx]
                            marker.node.x = ini
                            marker.node.y = inj
                            marker.node.idx = idx
                            bufferQueue.push(marker)
                        }
                    }
                }
            } // for 하나의 셀 반복문. buffer 삽입
            coreProcess(drones, cluster, bufferQueue, threshold, nodeCoverage)
        }
    }
    // 3사분면
    for(var exi = gridArray.x-1; exi >  centerPoint.x; exi--){
        for(var exj = 0; exj < centerPoint.y; exj++){  

            // 하나의 드론 영역 안에서의 작업
            bufferQueue = [];
            for(var ini = exi + apCoverageSize - 1; ini >= exi; ini--){
                for(var inj = exj; inj < exj + apCoverageSize; inj++){
                    // 하나의 cell 안에서의 작업
                    // 안에 있는 노드들을 buffer에 하나씩 (큐에) 삽입
                    // 이전에 남아있던 노드 뒤에 하나씩 추가된다
                    if(gridArray[ini]==undefined || gridArray[ini][inj]==undefined){

                    }
                    // 유효한 그리드인 경우 그 안의 마커를 하나씩 버퍼에 저장
                    else{        
                        for(idx in gridArray[ini][inj]){
                            var marker = gridArray[ini][inj][idx]
                            marker.node.x = ini
                            marker.node.y = inj
                            marker.node.idx = idx
                            bufferQueue.push(marker)
                        }
                    }
                }
            } // for 하나의 셀 반복문. buffer 삽입
            coreProcess(drones, cluster, bufferQueue, threshold, nodeCoverage)
        }
    }

    gridArray[centerPoint.x][centerPoint.y].center = true
}