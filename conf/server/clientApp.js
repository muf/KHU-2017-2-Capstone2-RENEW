// 사용자들이 서비스를 신청하기 위한 웹 앱 config
var tool = require('cloneextend')
    ,conf = {};
    conf.defaults = {
        server : {
            name : "clientApp",
            description:"web application page for clients to apply `AP in the sky` services",
            port : 3000
        }
    };

exports.get = function get(env, obj){
    var settings = tool.cloneextend(conf.defaults, conf[env]);
    return ('object' === typeof obj) ? tool.cloneextend(settings, obj) : settings;
}
