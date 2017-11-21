
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
        min : { type: Number, default: 0 },
        max : { type: Number, default: 0 }
    },
    contact:{
        email : { type: String, default: "" },
        number : { type: String, default: "" },
    },
    state: { type: String, default: 'applied' }, // 'submit / finished / denied / applied'
});
module.exports = mongoose.model('serviceApplication',serviceApplicationSchema);