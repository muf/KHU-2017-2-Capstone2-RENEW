var dependencies =[
    "data.js",
    "grid.js",
    "grouping.js",
    "window.js"
]
for(idx in dependencies){
    var dependency = dependencies[idx]
    console.log("dependency: " + dependency)
    $.getScript('/javascripts/side/sim/'+dependency,function(){console.log(dependency+' is loaded')})
}

function run(){
    // deleteDrones()
    // deleteAreas()
    // deleteCells()
    // deleteMarkers()
    // initGlobalVars()
    // reload()
    getNodeInfo()
    
    // addServiceArea(true)
}

