
var serviceApplication = require('../../../model/serviceApplication')
;
function getServicesByState(res, state, callback){
    serviceApplication.findServicesByState(state, function(err, list){
        if(typeof callback === 'function') {
            callback(res, list);
        }
    }, res)
}

module.exports.getServicesByState = getServicesByState