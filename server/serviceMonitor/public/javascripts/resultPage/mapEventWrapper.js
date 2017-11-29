
var mapEventWrapper = function(_mapHandler){

    _mapHandler.map.wrappers.mapEventWrapper = this

    // @ attribute
    this.area = null // init with null object
    this.drawArea = function(){
        if(this.area !== null){
            this.area.setMap(null)
            this.area = null
        }
        else{
            var bounds = {
                north: service.bounds.max.lat,
                south: service.bounds.min.lat,
                east: service.bounds.max.lng,
                west: service.bounds.min.lng
            };
    
            this.area = new google.maps.Rectangle({
                bounds: bounds,
                editable: false,
                draggable : false,
                strokeColor : "#003d99",
                getWidth : function(){
                    var bounds = this.bounds
                    return _mapHandler.util.distanceTo(bounds.f.f,bounds.b.f ,bounds.f.f ,bounds.b.b )
                },
                getHeight : function(){
                    bounds = this.bounds
                    return _mapHandler.util.distanceTo(bounds.f.f,bounds.b.f ,bounds.f.b ,bounds.b.f )
                }
            });
            this.area.setMap(_mapHandler.map)
        }
       
    }
    // @ method
    google.maps.event.addListener(_mapHandler.map, "dblclick", function(event) { //  mapHandler.map이 this..

       var lat = event.latLng.lat()
       var lng = event.latLng.lng()
       if(this.wrappers.inputMarkerWrapper!=undefined){
            this.wrappers.inputMarkerWrapper.addMarker(lat,lng)
        }
    }); // dblclick  


    return _mapHandler
  }// end
  