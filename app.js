
// load server configurations
var conf = require('./conf/main').get(process.env.NODE_ENV).server.conf
console.log(conf.server.name)
var app = require('./server/' + conf.server.name+'/app.js')
app(conf).run()