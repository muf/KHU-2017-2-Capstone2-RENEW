

function realLatMeter(meter){
    return meter * 0.000008996
}
function realLngMeter(meter){
    return meter * 0.000011335555
}
function toPyeongArea(area){
    return area * 0.3025 
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}
function distanceTo(point1, point2) {
    var lat1 = point1.lat
    var lat2 = point2.lat
    var lon1 = point1.lng
    var lon2 = point2.lng
    // console.log(`lat1:${lat1} lat1:${lat2} lng1:${lon1} lng2:${lon2}`)

    var R = 6371; // Radius of the earth in km
    var dLat = (lat2-lat1) * (Math.PI/180);  // deg2rad below
    var dLon = (lon2-lon1) * (Math.PI/180);  
    var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos((lat1) * (Math.PI/180)) * Math.cos((lat2) * (Math.PI/180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in meters
    // console.log("dist: "+ d*1000)
    // if(d==undefined) d = -1
    return d*1000
}
  

module.exports.deg2rad = deg2rad
module.exports.distanceTo = distanceTo
module.exports.toPyeongArea = toPyeongArea
module.exports.realLngMeter = realLngMeter
module.exports.realLatMeter = realLatMeter