
var express = require('express')
var router = express.Router()
var app = express()

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

appRunner.main(count)

module.exports = router