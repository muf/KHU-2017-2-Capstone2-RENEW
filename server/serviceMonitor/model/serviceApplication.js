
var mongoose = require('mongoose');  
var serviceApplicationSchema = new mongoose.Schema({  
    loggingDate: { type: Date, default: Date.now },
    serviceStartDate: Date,
    serviceEndDate: Date,
    bounds:{
        min:{
            lat : { type: Number, default: 0 },
            lng : { type: Number, default: 0 }
        },
        max:{
            lat : { type: Number, default: 0 },
            lng : { type: Number, default: 0 }
        }
    },
    drone:{
        num : { type: Number, default: 0 },
        min : { type: Number, default: 0 },
        max : { type: Number, default: 0 },
        current :{type: Number, default: 0},
        list : [{
            id: Number,
            ip: String
        }]
    },
    contact:{
        email : { type: String, default: "" },
        number : {type: String, default: "" },
    },
    state: { type: String, default: 'applied' }, // 'submit / finished / denied / applied'
    server: {
        ip: { type: String, default: '0.0.0.0' },
        port: { type: String, default: '3005' }
    },
    executorId: Number
});

serviceApplicationSchema.statics.findByState = function(state, element) {
    return this.find({ state: new RegExp(state, 'i') }, element)
}

module.exports = mongoose.model('serviceApplication',serviceApplicationSchema);