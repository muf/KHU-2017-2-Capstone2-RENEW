
var request = require('request')
var async = require('async');

var dir = new Map();
dir.set('view', __dirname +"/../view/")
dir.set('private', __dirname +"/../private/")
// @ load models & methods
//var dao = require(dir.get('private') + 'javascript/common/db.js')


function main(count){
    // 일반 while문과는 다르게 안에 내용이 다 수행되고 나서야 오기 때문에 동기화 상황에서 안정적으로 사용할 수 있을 것으로 추정됨.
    async.whilst(
        function () { 
            console.log("check conditions...")
            return count < 5; 
        },
        function (callback) {
            count++;
            setTimeout(callback, 1000);
        },
        // 반복 다 끝나면 여기로
        function (err) {
            // 5 seconds have passed
            process.exit()
        }
    )
}
module.exports.main = main
