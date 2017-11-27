
var mongoose = require('mongoose');  
var blobSchema = new mongoose.Schema({  
        blobId:Number,
        basePath:{type:String, default: '/Users/junghyun.park/Desktop/git/KHU-2017-2-Capstone2-RENEW/blob'},
        path: String,
        fileName: String,
        fileType: String
});

module.exports = mongoose.model('blob',blobSchema);