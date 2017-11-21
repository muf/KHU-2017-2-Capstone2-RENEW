
// var g_clusteredNodesMap = new Map()  // data from clustered csv data
// var g_clusteredNodes       // data from unclustered csv data

// var bufferQueue = [];           // buffer queue for saving temporary node data
// var g_filteredNodes = []        // node data # removed noise data    

// var rec_areas = []   // name should be changed. this is rectangular shape for service area
// var rec_cells = []   // grid rec_cells array for service area. # only uesd for drawing grid lines. not including node data.
// var rec_drones = [] 
// var map_drones = []

// var g_drones = []     // grouped rec_cells array 

// var gridArray;          // grid cell array for node data
// var arrXSize, arrYSize  // gridArray length size # gridArray[arrXSize][arrYSize]
// var g_centerOfGravity = { lat:0, lng:0 }     // center of gravity for weight of drones

// g_clusteredNodesMap["keys"] = []     
    
// var meter = 0.00001  // 1 meter value in LAT/LNG stytem
// var xTimes = 1000000 // xTimes for calculating relative values

// var X0, XM, Y0, YM       // rectangle area for service # relative values
// var rX0, rXM, rY0, rYM   // rectangle area for service # absolute values

// var nodeCoverage = 10
// var apCoverage = 100 * meter * xTimes    // drone ap coverage value # relative value
// var gridSize                             // cell grid Size # relative value

// function initGlobalVars(){
//     g_clusteredNodes = []
//     g_clusteredNodesMap = new Map()
//     g_filteredNodes = [] 
//     g_drones = []
//     g_centerOfGravity = { lat:0, lng:0 }
// }
