
var request = require('request')
var async = require('async')


var testMode = true
var logic = require(__dirname+'/logic.js')
// var drone = require(__dirname+'/drone.js')
var ready = false
var serverURI = "http://14.33.77.250"
var serviceMonitorPort=":3002"
// @ load models & methods
var interrupt = {kill:false, pause:true}
var mutex = {lock:false, timer:null}
var errCount = 0
var taskTick = false
var service; //lazy인듯
var seq = -1;
var errList= []
var outputFileData = [];
var updateFlag = true
function update(flag){
    updateFlag = flag
}
function getUpdate(){
    temp = updateFlag
    return temp
}
function main(count){
    // 매 주기 마다 상태를 체크한다.
    console.log("main start")
    readyForTask() 
    async.whilst(
        function () { 
            // 매 초 확인. kill이 들어오면 즉시 종료
            count++
            // 비상 종료 
            if(count > 500000){
                //interrupt.kill
                interrupt.kill= true
            }
            if(interrupt.kill){
                return false
            }
            // 특정 주기를 기준으로 돌려야 한다.
            // mainTask 도중에는 변경하면 안된다.
            if(!mutex.lock && !interrupt.pause){
                var nextSeq = getCycleSeqence()
                console.log(nextSeq)
                if(nextSeq == -2){
                    process.exit()
                }
                if(nextSeq < 0) {
                    errList.push("시간이 맞지 않습니다.")
                    interrupt.kill = true  // for test
                }
                if(nextSeq > seq ){
                    console.log(`seq : ${seq} -> ${nextSeq}`)
                    seq = nextSeq // 더 큰 seq라면 업데이트
                    taskTick = true // task 준비 완료 신호
                } 
                
            }
            return true
        },
        function (callback) {
            if(errCount > 100){
                callback(err = {message: "mainTask가 정상적인 시간내에 종료되지 않음."})
            }
            checkTimer = setTimeout(function(){
               callback()
            }, 100); 
            // 비동기 함수. 문제 발생 시 임의로 pause 할 수 있다.
            if(!interrupt.pause && taskTick){
                mainTask(callback)
            }
            
        },
        // 반복 다 끝나면 여기로
        function (err) {
            if(err) console.log(err.message)
            exitProcess()
        }
    )
}
function readyForTask(){
    // serviceId 챙겨오기
    async.waterfall([
        getServiceData,
        function(result, callback){
            // 드론 최초 위치 잡기
            // 다 잡으면 pause 풀기
            callback(null, result)
        }
      ], function (err, result) {
        interrupt.pause = false
      });
    // service 가져오기

}
function getServiceData(callback){
    // serviceId 챙겨오기
    var serviceId = process.argv[3]    
    console.log("id:"+serviceId)

    request({
        url : "http://localhost:3002/getServiceApplication",
        method:"POST",
        json:true,
        body:{serviceId},
        },function (err, response, body) {
            if (err) callback(err, true)
            service = response.body
            callback(null, response.body)
        }
    )
}
// 데이터 읽어와서 변수에 저장
function getInputData(result, callback){ 
    request({
        url : "http://localhost:3002/getBlobData",
        method:"POST",
        json:true,
        body:{path:service.blob.inputBasePath + service.blob.fileName},
        },function (err, response, body) {
            if (err) callback(err, true)
            inputStream = response.body
            callback(null, response.body)
        }
    )
}
function mainTask(callback){
    taskTick = false

    // 클러스터 돌려서 변수에 저장
    // 알고리즘 돌려서 결과 변수에 저장
    // 드론 명령 후 확인

    if(mutex.lock == false){
        errCount = 0 // 에러 카운트 초기화
        mutex.lock = true
        console.log("-----------------------------  START -----------------------------")
        async.waterfall([
            function(callback){
                callback(null, "none")
            },
            makeClusterData,
            runAlgorithm,
            controlDrones,
            function(result, callback){

                callback(null, result)
            }
          ], function (err, result) {
            mutex.lock = false
            updateFlag = true
            if(ready){
                interrupt.kill = true 
            }
            console.log("-----------------------------   END   ----------------------------")
          });
    }
    else{
        errCount++; //시간이 됬는데 lock 안풀려서 진입 못하는 횟수 증가
    }
}
function makeClusterData(result, callback){

    request({
        url : "http://localhost:3002/getClusteredData",
        method:"POST",
        json:true,
        body:{path:service.blob.inputBasePath + service.blob.fileName, seq: seq},
        },function (err, response, body) {
            if (err) callback(err, true)
            callback(null, response.body)
        }
    )
    
}
function runAlgorithm(result, callback){
    console.log("run algorithm")
    result = logic.makeClusterList(result)
    result = logic.makeGrids(result)
    result = logic.makeGroups(result)
    logic.selectingDrones(result,function(rawList){

        var outputData = rawList
        outputData.clusters = strMapToObj(outputData.clusters)
        outputFileData.push(outputData)
        callback(null, rawList)
    })
}
function strMapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k,v] of strMap) {
        // We don’t escape the key '__proto__'
        // which can cause problems on older engines
        obj[k] = v;
    }
    return obj;
}
function objToStrMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}
function controlDrones(result, callback){
    console.log("controll Drones")
    // 드론 3대.. 이동해야하는 위치도 3군데.. 가장 가까운 드론을 우선 배치하는게 맞음.
    // 즉 n개 자리. n개 드론. n!... 아놔 이건 어떡하지 ㅋㅋㅋ 모르는척 할까.. mcmf로 해결 가능 나중에 임베딩해서 쓰자. 일단 패스
    // result = logic.mcmf(result.drones.slice(0,3), service.drone.list)
    var i = 0;
    var index = 0;
    var tasks = [];
    async.waterfall([
        function(callback){
            async.whilst(
                function () { 
                    // 매 초 확인. kill이 들어오면 즉시 종료
                    return i < service.drone.list.length
                },function(callback){
                    var drone = result.drones[i]
                    if(drone != undefined){
                        var position = drone.position
                    
                        tasks.push(function(callback){
                            async.waterfall([
                                function(callback){
                                    // console.log(service)
                                    request({
                                        url : serverURI + serviceMonitorPort + "/send",
                                        method:"POST",
                                        json:true,
                                        body:{
                                            mac:service.drone.list[index].mac,
                                            msg:[{cmd:'gotoPos'}]
                                        },
                                        },function (err, response, body) {
                                            if (err) console.log(err)
                                            // console.log(body)
                                            callback(null,body)
                                        }
                                    ) 
                                }
                            ],function(err,result){
                                index++
                                callback(null,result)
                            })
                        })
                    }
                    i++
                    callback(null,"ok")
                    // setTimeout(function(){callback(null)},1000)
                },function(err,result){
                    callback(null,"ok")
                })
            },
            function(result){
                async.series(tasks, function (err, result) {
                    callback(null, result)
                });
            }
    ],function (err, result) {
        callback(null, result)
      });
}
function writeResult(callback){
    //outputFileData

    var data =  JSON.stringify(JSON.stringify(outputFileData))
    var outputPath = '/Users/junghyun.park/Desktop/git/KHU-2017-2-Capstone2-RENEW/blob/output/'

    request({
        url : "http://localhost:3002/saveOutputBlob",
        method:"POST",
        json:true,
        body:{input:JSON.stringify(outputFileData),serviceId: service._id},
        },function (err, response, body) {
            if (err) callback(err, true)
            callback(null, response.body)
        }
    )
}
function exitProcess(){
    // db 등 정리 
    console.log("ready..")
    // 결과물 파일 출력
    writeResult(function(err, result){
        if(err) console.log(err)
        errList.forEach(function(err){console.log("App Err: " + err)})
        console.log("bye...")
        request({
            url : "http://localhost:3002/updateServiceApplicationState",
            method:"POST",
            json:true,
            body:{state:"finished", serviceId: service._id},
            },function (err, response, body) {
                if (err) console.log(err)
                process.exit()
            }
        )
    })
}
function getCycleSeqence(){
    var currentCycle = getCycle(new Date())
    var startCycle = getCycle(new Date(service.serviceStartDate))
    var endCycle = getCycle(new Date(service.serviceEndDate))
    if(currentCycle < startCycle) return -2
    if(currentCycle+1 > endCycle) ready = true
    if(currentCycle > endCycle) return -1
    else{
        var seq = currentCycle - startCycle
        return seq >= 0 ? seq : -1 
    }
}
function getCycle(date){
	var d1 = new Date(Math.floor(date/10000))
	return d1.getTime() 
}

module.exports.main = main
module.exports.outputFileData = outputFileData
module.exports.update = update
module.exports.getUpdate = getUpdate

