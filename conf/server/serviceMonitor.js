// 서비스를 제공하기 위해 관리하는 관리자들을 위한 웹 앱 
var tool = require('cloneextend')
    ,conf = {};
    conf.defaults = {
        server : {
            name : "serviceMonitor",
            description:"web application for managers to provide and control `AP in the sky` services",
            port : 3002
        }
    };

exports.get = function get(env, obj){
    var settings = tool.cloneextend(conf.defaults, conf[env]);
    return ('object' === typeof obj) ? tool.cloneextend(settings, obj) : settings;
}
