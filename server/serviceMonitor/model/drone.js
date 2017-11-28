
var mongoose = require('mongoose');  
var droneSchema = new mongoose.Schema({  
    ip: { type: String, default: '0.0.0.0' },
    mac : {type: String, default: '0'},
    port: { type: String, default: '0000' },
    model: { type: String, default: 'bebop2' },
    state: { type: String, default: 'ready' },
    gps: {
        lat: { type: String, default: -1 },
        lng: { type: String, default: -1 }
    },
    services:[{id: String, serviceStartDate: Date, serviceEndDate: Date}]
});

droneSchema.statics.findAllDrones = function(element) {
    return this.find({}, element);
};
  
module.exports = mongoose.model('drone',droneSchema);