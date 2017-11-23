
var drone = require('../../../model/drone')
;
function getDrones(res, state, callback){
    drone.findAllDrones(state, function(err, list){
        if(typeof callback === 'function') {
            callback(res, list);
        }
    }, res)
}

module.exports.getDrones = getDrones