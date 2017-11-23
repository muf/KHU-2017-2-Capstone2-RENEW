const argv = require('minimist')(process.argv.slice(2));
var conf = {}
console.log(argv)
// 파라미터를 추가적으로 받지 않는 경우 conf/main에 설정된 serverName 값을 참고하고 conf load
if(argv.config == undefined){
    conf = require('./conf/main').get(process.env.NODE_ENV).server.conf
}
// 파라미터를 전달받아서 실행되는 경우 값을 받아서 config serverName 설정 후 conf load
else{
    var serverName = argv.config
    conf = require('./conf/server/'+serverName).get(process.env.NODE_ENV)
}

console.log(conf.server.name)
var app = require('./server/' + conf.server.name+'/app.js')

app(conf).run()
