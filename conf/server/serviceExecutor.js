
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
