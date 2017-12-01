
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
    blob:{
        inputBasePath:{type:String, default: '/Users/junghyun.park/Desktop/git/KHU-2017-2-Capstone2-RENEW/blob/input/'},
        outputBasePath:{type:String, default: '/Users/junghyun.park/Desktop/git/KHU-2017-2-Capstone2-RENEW/blob/output/'},
        fileName: {type: String, default:""}
    },
    drone:{
        num : { type: Number, default: 0 },
        list : [{
            id: String,
            mac: String
        }]
    },
    contact:{
        email : { type: String, default: "" },
        number : {type: String, default: "" },
    },
    state: { type: String, default: 'applied' }, // 'submit / finished / denied / applied / execute'
    server: { // executor server
        pid: {type: Number, default: -1 },
        port: { type: Number, default: -1 }
    }
});


serviceApplicationSchema.statics.findByState = function(states, element) {
    return this.find({ state: {$in: states}}, element)
}

module.exports = mongoose.model('serviceApplication',serviceApplicationSchema);