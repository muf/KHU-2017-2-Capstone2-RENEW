
var express = require('express')
var router = express.Router()
var app = express()

var request = require('request')
var cors = require('cors');
var async = require('async');

var dir = new Map();
dir.set('view', __dirname +"/../view/")
dir.set('private', __dirname +"/../private/")
var count = 0
// @ load models & methods
var appRunner = require(dir.get('private') + 'javascript/main.js')

// @redirect
router.get('/',function(req, res, next) {
  console.log('get /')
  res.redirect('/run')
})
 
router.get('/run',function(req, res, next) {
  console.log('get /run')
  res.render(dir.get('view') + '/index.ejs', {count:count})
})

// @app use
app.use(function(err, req, res, next) {
  console.log("error check")
  console.log(err)
})

router.get('/update',function(req,res){
    var index = appRunner.outputFileData.length-1
    var data = appRunner.outputFileData[index]
    
    var flag = appRunner.getUpdate()
    if(flag){ // 새로운 데이터가 있습니다.
        appRunner.update(false)
        res.json({data})
    }
    else{
        res.json({flag})
    }
})

router.get('/controllerPage?:mac',function(req, res, next) {
    var mac = req.query.mac
    res.render(dir.get('view') + '/controllerPage.ejs',{mac});
});

router.get('/resultPage?:serviceId',function(req, res, next) {
    var serviceId = req.query.serviceId
    // 결과물 읽어서 json 형태로 가져온 다음 넘기자.
    // test로 가져오자 일단.
    req.body.serviceId = serviceId
    async.waterfall([
        function (callback) {
            request({
                url:'http://localhost:3002/getServiceApplication',
                method:"POST",
                json:true,
                body:req.body,
                },function (err, response, body) {
                    if (err) callback(err, data)
                    callback(null, body)
                }
            )
        },
      ], function (err, data) {
            res.render(dir.get('view') + '/resultPage.ejs',{data: data})
      });
    
});


appRunner.main(count)

module.exports = router