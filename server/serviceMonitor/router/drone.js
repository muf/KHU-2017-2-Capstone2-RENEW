
var express = require('express')
var router = express.Router()
var app = express();
var cors = require('cors');

var dir = new Map();
dir.set('view', __dirname +"/../view/")
dir.set('private', __dirname +"/../private/")

// @ load models & methods
var drone = require(dir.get('private') + 'javascript/common/drone.js')
process.test = {}
process.test.drone = drone
// @redirect
router.post('/connect', cors(),function(req, res, next) {
    var mac = req.body.mac
    drone.connect(mac)
    process.test.mac = mac
    console.log('get / connect');
    res.json("connect")
});
router.post('/disconnect', cors(),function(req, res, next) {
    var mac = req.body.mac
    drone.disconnect(mac)
    process.test.mac = mac
    console.log('get / disconnect');
    res.json("disconnect")
});

router.post('/send', cors(),function(req, res, next) {
    var mac = req.body.mac
    var msg = req.body.msg

    console.log('get / send');
    drone.send(mac,msg,function(err){
        if(err) {
            return res.status(500).send(err.message)
        }
        res.json("send")
    })
});

router.post('/receive', cors(),function(req, res, next) {
    console.log('get / receive');
    var mac = req.body.mac
    var msg = drone.receive(mac)
    res.json(msg)
});
// @app use
app.use(function(err, req, res, next) {
  console.log("error check");
  console.log(err);
})

module.exports = router