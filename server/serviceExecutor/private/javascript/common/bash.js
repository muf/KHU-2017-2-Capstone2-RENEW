const { spawn } = require('child_process');

function run(query, callback){
    result = {}
    // exec(query, (error, stdout, stderr) => {
    //   if (error) {
    //     console.error(`exec error: ${error}`);
    //   }
    //   result.error = error;
    //   result.stdout = stdout;
    //   result.stderr = stderr;

    //     if(typeof callback === 'function') {
    //         callback(result)
    //     }
    // });
    //
    // const ls = spawn('query', ['-lh', '/usr']);
    const ls = spawn(query);
    
    ls.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      
    });
    
    ls.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });
    
    ls.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    }); 
    if(typeof callback === 'function') {
        callback(ls.pid)
    }
  }

module.exports.run = run