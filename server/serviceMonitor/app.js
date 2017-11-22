
// conf를 받아서 run() 함수를 적절하게 실행시킬 수 있는 함수 객체를 반환

module.exports = function(conf) {
    return {
        run: function(){
            // load node modules
            var express = require('express')
            var path = require('path');
            var bodyParser = require('body-parser');
            var mongoose    = require('mongoose');

            var http = require('http')

            // load router sub apps
            var index_router = require('./router/index')
            var dataAccess_router = require('./router/dataAccess')
            var appliedService_router = require('./router/appliedServicePage')
            var submitServicePage_router = require('./router/submitServicePage')
            // make instances
            var app = express()

            // on application

            // set application

            // use application
            app.use(express.static(path.join(__dirname, 'public'))); // static default path to public ex) /css == ... $ROOT/public/css
                // 이렇게 해두면 public 밑에만 static 하게 접근되고, 이보다 부모 디렉토리이거나 형제 디렉토리인 경우 임의로 접근이 불가. 보안 관리 측면의 옵션이라고 볼 수도 있다.
                // 단 ejs의 경로를 제어 하는 것이니 헷갈리지 마시길
            app.use(bodyParser.json()); // parse body of response to json 
            app.use(bodyParser.urlencoded({ extended: true })); // parse the text as url encoded data. [false]:parse only once. [true]:parse every time (?????)
                // register rounter sub apps
            app.use('/', index_router) 
            app.use('/', dataAccess_router) 
            app.use('/', appliedService_router)
            app.use('/', submitServicePage_router)
            
            // use error check
            app.use(function(err, req, res, next) {
            console.log("ERROR : APP.JS");
            console.log("MSG: "+err);
            })

            // connect sub apps

            // listen application
            app.listen(conf.server.port, function(){
                console.log("Application [ %s ] is Running on %s port", conf.server.name, conf.server.port);
            });
        }
    };
}




