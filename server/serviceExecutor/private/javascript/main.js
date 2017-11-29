
var request = require('request')
var async = require('async')
var request = require('request')



var logic = require(__dirname+'/logic.js')

// @ load models & methods
var interrupt = {kill:false, pause:true}
var mutex = {lock:false, timer:null}
var errCount = 0
var taskTick = false
var service; //lazy인듯
var seq = -1;
var errList= []
var outputFileData = [];
function test(clusters){
    console.log(clusters)
}
function main(count){
    // 매 주기 마다 상태를 체크한다.
    // 
    console.log("main start")
    readyForTask()
    async.whilst(
        function () { 
            // 매 초 확인. kill이 들어오면 즉시 종료
            count++
            // close test용 함수
            if(count > 10){
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
                nextSeq = seq +1;//test@@@
                if(nextSeq < 0) {
                    errList.push("시간이 이미 만료된 서비스")
                    interrupt.kill = true
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
            count++;
            if(errCount > 3){
                callback(err = {message: "mainTask가 정상적인 시간내에 종료되지 않음."})
            }
            checkTimer = setTimeout(function(){
               callback()
            }, 1000); 
            // 비동기 함수. 문제 발생 시 임의로 pause 할 수 있다.
            if(!interrupt.pause && taskTick){
                mainTask(callback)
            }
            
        },
        // 반복 다 끝나면 여기로
        function (err) {
            if(err) console.log(err.message)
            // 5 seconds have passed
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
    console.log(service)
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
    // 드론 도착 확인.. (이게 너무 먼 거리가 되는 경우 ..? 이상한게 맞음)

    if(mutex.lock == false){
        errCount = 0 // 에러 카운트 초기화
        mutex.lock = true
        console.log("func start@@@@@@@@@@@@@@@@@@@@@@@@@@2")
        async.waterfall([
            function(callback){
                callback(null, "none")
            },
            makeClusterData,
            runAlgorithm,
            // controlDrones,
            function(result, callback){

                callback(null, result)
            }
          ], function (err, result) {
            mutex.lock = false
            console.log("func finished.##################")
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
            // console.log(response.body)
            callback(null, response.body)
        }
    )
    
}
function runAlgorithm(result, callback){
    console.log("run algorithm")
    result = logic.makeClusterList(result)
    test(result)
    result = logic.makeGrids(result)
    result = logic.makeGroups(result)
    result = logic.selectingDrones(result)

    // 결과 만들어서 push push 
    var outputData = result
    outputFileData.push(outputData)
    callback(null, result)
}
function controlDrones(result, callback){
    console.log("controll Drones")
    console.log(service)
    // 드론 3대.. 이동해야하는 위치도 3군데.. 가장 가까운 드론을 우선 배치하는게 맞음.
    // 즉 n개 자리. n개 드론. n!... 아놔 이건 어떡하지 ㅋㅋㅋ 모르는척 할까.. mcmf로 해결 가능 나중에 임베딩해서 쓰자. 일단 패스
    // result = logic.mcmf(result.drones.slice(0,3), service.drone.list)
    var i = 0;
    tasks = [];
    async.waterfall([
        function(callback){
            var tasks;
            async.whilst(
                function () { 
                    // 매 초 확인. kill이 들어오면 즉시 종료
                    console.log("@@@ i : " + i)
                    i++
                },function(callback){
                    var drone = result.drones[i]
                    var position = drone.position
                    tasks.push(function(callback){
                        setTimeout(function(){
                            callback(null, "ok: " + i)
                         }, 1000); 
                    })
                },function(err){
                    callback(null)
            })
        },
        function(result, callback){
            async.waterfall(tasks, function (err, result) {
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
    if(currentCycle > endCycle) return -1
    else{
        var seq = currentCycle - startCycle
        return seq > 0 ? seq : -1 
    }
}
function getCycle(date){
	var d1 = new Date(Math.floor(date/60000))
	return d1.getTime() 
}

module.exports.main = main
