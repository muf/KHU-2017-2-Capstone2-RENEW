// 사용자 데이터 정보를 가상으로 생성해주는 제너레이터 웹 앱
var tool = require('cloneextend')
    ,conf = {};
    conf.defaults = {
        server : {
            name : "dataGenerator",
            description:"web application provides virtual user infomation data for  `AP in the sky` services",
            port : 3001
        }
    };

exports.get = function get(env, obj){
    var settings = tool.cloneextend(conf.defaults, conf[env]);
    return ('object' === typeof obj) ? tool.cloneextend(settings, obj) : settings;
}
