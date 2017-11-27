
var request = require('request')
var async = require('async');
var request = require('request')

var dir = new Map();
dir.set('view', __dirname +"/../view/")
dir.set('private', __dirname +"/../private/")
// @ load models & methods
//var dao = require(dir.get('private') + 'javascript/common/db.js')
var count2 = 0
var interrupt = {kill:false, pause:true}
var mutex = {lock:false, timer:null}
var errCount = 0
// mutexCheckTimer = setInterval(function(){
//     console.log("check : " + mutex.lock)
//     if(mutex.lock == false){
//         clearInterval(this.mutexCheckTimer)
//     }
// }, 1000); 
var taskTick = false
var tempTickStack = 0
var service;
var inputStream
function main(count){
    // 매 주기 마다 상태를 체크한다.
    // 
    readyForTask()
    async.whilst(
        function () { 
            // 시간이 되었는데.. 아직도 돌고 있음..
            console.log("count:"+ count)
            // 매 초 확인. kill이 들어오면 즉시 종료
            if(interrupt.kill){
                return false
            }
            // 특정 주기를 기준으로 돌려야 한다.
            if(tempTickStack > 1){
                tempTickStack = 0
                taskTick = true
            }
            // task가 끝나는 순간부터 다시 하나씩 쌓는다.
            if(!taskTick && !interrupt.pause){
                tempTickStack++
            }
            return count < 500    

            // 시간 체크
           
        },
        function (callback) {
            count++;
            console.log("func1")
            if(errCount > 3){
                callback(err={message:"func이 끝나지 않아 errCount 초과"})
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
        getInputData,
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
    // 결과물 파일 출력
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

function makeClusterData(){

}
function runAlgorithm(){

}
function writeResult(){

}
function droneControl(){

}
function exitProcess(){
    // db 등 정리 
    process.exit()
}
module.exports.main = main
/*
function isSameCycle(date1, date2){
	var d1 = new Date(Math.floor(date1/60000)*60000)
	var d2 = new Date(Math.floor(date2/60000)*60000)
	console.log(d1.getTime())
	console.log(d2.getTime())
	return d1.getTime() == d2.getTime()
}
*/