
var fs = require('fs');
const { exec,spawn } = require('child_process');
const logPath = "/Users/junghyun.park/Desktop/git/KHU-2017-2-Capstone2-RENEW/sh_scripts/log"
function run(query, callback, block = false){
    var result=""
    // const proc = spawn(query.program, query.params);
    
    var proc = spawn(query.program,query.params)

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
            if (err){
                console.log(`logging failed ${err.message.toString()}`);
            }
        });
        //if(block == true) callback(result)
    });

    if(typeof callback === 'function'){
        callback(proc)
    }
  }
  function getPortByPid(proc, callback){
    var pid = proc.pid
	var query = "lsof -Pan -p " + pid + " -i | grep \'*\' | awk \'{split($9,data,\":\"); printf(\"\\n\");printf(\"%s\",data[2]);}\'"
    console.log(query)
    setTimeout(function(){    
        exec(query, (error, stdout, stderr) => {
            if (error) {
            console.error(`exec error: ${error}`);
            return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            
            if(typeof callback === 'function'){
                callback({pid:proc.pid, port: stdout.trim()})
            }
        });
    },2000)
    //   var query = "lsof -Pan -p " + pid + " -i | grep \'*\' | awk \'{split($9,data,\":\"); printf(\"\\n\");printf(\"%s\",data[2])}\'"
    //   console.log(query)
    //   var data = []
    //   var proc = exec(query, function(err,stdout,stderr){
    //       callback({err, stdout, stderr})
    //   })
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
function runExecutor(serviceId ,callback){
    var program = 'node'
    var params = ['/Users/junghyun.park/Desktop/git/KHU-2017-2-Capstone2-RENEW/app.js', '--config=serviceExecutor', serviceId]
    var query = {program: program, params: params}
    console.log(query)
    run(query, function(proc){
        getPortByPid(proc, function(address){
            callback(address)
        })
    })
}

function runClusterMaker(path ,callback){
    var program = 'r'
    var params = {
        code: '/Users/junghyun.park/Desktop/git/KHU-2017-2-Capstone2-RENEW/app.js',
        path: path
    }
    var query = {program: program, params: params}
    console.log(query)
    runR(query, function(clusterPath){
        callback(clusterPath)
    })
}

function runR(query, callback){
    var path = query.params.path
    var query = `echo ${path}`
    // var clusterPath = path.split('.input')[0]+'.cluster'
    var clusterPath = path
    console.log(query)
    setTimeout(function(){    
        exec(query, (error, stdout, stderr) => {
            if (error) {
            console.error(`exec error: ${error}`)
                return
            }
            console.log(`stdout: ${stdout}`)
            console.log(`stderr: ${stderr}`)
            
            if(typeof callback === 'function'){
                callback(clusterPath)
            }
        });
    },2000)
    //   var query = "lsof -Pan -p " + pid + " -i | grep \'*\' | awk \'{split($9,data,\":\"); printf(\"\\n\");printf(\"%s\",data[2])}\'"
    //   console.log(query)
    //   var data = []
    //   var proc = exec(query, function(err,stdout,stderr){
    //       callback({err, stdout, stderr})
    //   })
  }
module.exports.run = run
module.exports.runClusterMaker = runClusterMaker
module.exports.getRealPid = getRealPid
module.exports.getPortByPid = getPortByPid
module.exports.runExecutor = runExecutor