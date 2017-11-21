// 사용자 데이터 정보를 가상으로 생성해주는 제너레이터 웹 앱
var tool = require('cloneextend')
,conf = {};
conf.defaults = {
    server : {
        name : "serviceExecutor",
        description:"web application provides actual `AP in the sky` service",
        port : 3003
    }
};

exports.get = function get(env, obj){
var settings = tool.cloneextend(conf.defaults, conf[env]);
return ('object' === typeof obj) ? tool.cloneextend(settings, obj) : settings;
}
