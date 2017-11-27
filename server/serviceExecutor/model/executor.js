
var mongoose = require('mongoose');  
var executorSchema = new mongoose.Schema({  
    ip: { type: String, default: '0.0.0.0' },
    port: { type: String, default: '0000' },
    drones: { droneId: Number },
    state: { type: String, default: 'ready' }, // ready(submit), running(executed), finished
    storage: {
        userData: {
            blobId: Number
        },
        output: {
            blobId: Number
        }
    }
});

module.exports = mongoose.model('executor',executorSchema);