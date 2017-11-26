
var fs = require('fs');
const { exec,spawn } = require('child_process');
const logPath = "/Users/junghyun.park/Desktop/git/KHU-2017-2-Capstone2-RENEW/sh_scripts/log"
function run(query, callback, block = false){
    var result=""
    // const proc = spawn(query.program, query.params);
    
    var proc = spawn(query.program,query.params,)

    proc.stdout.on('data', (data) => {
        result += `stdout: ${data}`
        console.log(`stdout: ${data}`)
    });
    
    proc.stderr.on('data', (data) => {
        result += `stderr: ${data}`
        console.log(`stderr: ${data}`)
    });
    
    proc.on('close', (code) => {

        console.log(`child process exited with code ${code}`);
        fs.writeFile(logPath + '/serviceExecutor/serviceExecutor-'+proc.pid+"-"+new Date().getTime()+'.log',result, function(err) {
          if (err) throw err;
        });
        //if(block == true) callback(result)
    });

    if(typeof callback === 'function'){
        callback(proc)
    }
  }
  function getPortByPid(pid, callback){
      var query = "lsof -Pan -p " + pid + " -i | grep \'*\' | awk \'{printf(\"%s\\n\",$9);split($9,data,\":\"); printf(\"%s\\n\",data[2])}\'"
      console.log(query)
      var data = []
      var proc = run(query, function(result){
          callback(result)
      },true)
  }

function getRealPid(pid, callback){

    var query = "echo " + pid
    console.log(query)
    var data = []
    var proc = run(query, function(result){
        console.log("test")
        callback(result)
    },true)
}
function runExecutor(callback){
    var program = 'node'
    var params = ['/Users/junghyun.park/Desktop/git/KHU-2017-2-Capstone2-RENEW/app.js', '--config=serviceExecutor']
    var query = {program: program, params: params}
    console.log(query)
    var proccess = run(query, function(proc){
        callback(proc)
    })
}
  
module.exports.run = run
module.exports.getRealPid = getRealPid
module.exports.getPortByPid = getPortByPid
module.exports.runExecutor = runExecutor