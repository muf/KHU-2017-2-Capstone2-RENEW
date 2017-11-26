// 전체 config 중 하나를 선택해서 사용
var tool = require('cloneextend'), conf = {};

var serverName = 'serviceMonitor'

conf.defaults = {
    server : {
        name : serverName,
        description:"selected server name to be execute",
        conf : require('./server/'+serverName).get(process.env.NODE_ENV)
    }
};

exports.get = function get(env, obj){
var settings = tool.cloneextend(conf.defaults, conf[env]);
return ('object' === typeof obj) ? tool.cloneextend(settings, obj) : settings;
}
