
var mongoose = require('mongoose');  
var blobSchema = new mongoose.Schema({  
        blobId:Number,
        path: String,
        fileName: String,
        fileType: String
});

module.exports = mongoose.model('blob',blobSchema);