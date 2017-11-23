
var mongoose = require('mongoose');  
var droneSchema = new mongoose.Schema({  
    ip: { type: String, default: '0.0.0.0' },
    port: { type: String, default: '0000' },
    model: { type: String, default: 'bebop2' },
    state: { type: String, default: 'ready' }
});

droneSchema.statics.findAllDrones = function(state, element) {
    return this.find({ state: new RegExp('', 'i') }, element);
};
  
module.exports = mongoose.model('droneSchema',droneSchema);