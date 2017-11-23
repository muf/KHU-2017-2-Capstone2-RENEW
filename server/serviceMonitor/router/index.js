
var express = require('express')
var router = express.Router()
var app = express();

// @redirect
router.get('/',function(req, res, next) {
  console.log('get /');
  res.redirect('/submitServicePage')
});
 
router.get('/main',function(req, res, next) {
  console.log('get /main');
  res.redirect('/submitServicePage')
});

// @app use
app.use(function(err, req, res, next) {
  console.log("error check");
  console.log(err);
})

module.exports = router