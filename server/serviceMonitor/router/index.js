var express = require('express')
var router = express.Router()
var app = express();

var dir = new Map();
dir.set('view', __dirname +"/../view/")
dir.set('private', __dirname +"/../private/")

// @redirect
router.get('/',function(req, res, next) {
  console.log('get /');
  res.redirect('/registerPage')
});

// @render
router.get('/main',function(req, res, next) {
  console.log('get /main');
  res.redirect('/registerPage')
});

router.get('/index',function(req, res, next) {
  console.log('get /index');
  res.render(dir.get('view') + '/index.ejs');
});

router.get('/registerPage',function(req, res, next) {
  console.log('get /registerPage');
  res.render(dir.get('view') + '/registerPage.ejs');
});

// @ajax GET
// @ajax POST

// @app use
app.use(function(err, req, res, next) {
  console.log("error check");
  console.log(err);
})

module.exports = router