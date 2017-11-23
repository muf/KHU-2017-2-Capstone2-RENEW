var express = require('express')
var router = express.Router()
var app = express();

var dir = new Map();
dir.set('view', __dirname +"/../view/")
dir.set('private', __dirname +"/../private/")

// @redirect
router.get('/',function(req, res, next) {
  console.log('get /');
  res.redirect('/generatorPage')
});

// @render
router.get('/main',function(req, res, next) {
  console.log('get /main');
  res.redirect('/generatorPage')
});

router.get('/index',function(req, res, next) {
  console.log('get /index');
  res.render(dir.get('view') + '/index.ejs');
});

router.get('/generatorPage',function(req, res, next) {
  console.log('get /generatorPage');
  res.render(dir.get('view') + '/generatorPage.ejs');
});

// @ajax GET
// @ajax POST

// @app use
app.use(function(err, req, res, next) {
  console.log("error check");
  console.log(err);
})

module.exports = router