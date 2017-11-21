
var mapEventWrapper = function(_mapHandler){
    // @ attribute
    this.mapHandler = _mapHandler
    this.area = null // init with null object

    // @ method
    google.maps.event.addListener(this.mapHandler.map, "dblclick", function(event) { //  mapHandler.map이 this..
        if(eventWrapper.area !== null){
            eventWrapper.area.setMap(null)
            eventWrapper.area = null
        }
        var lat = event.latLng.lat()
        var lng = event.latLng.lng()
        console.log(lat+" / "+lng)  
        var defaultWidth = 100; // 영역의 기본 값으로 100 x 100 m^2 정사각형 공간을 할당

        var bounds = {
            north: lat + eventWrapper.mapHandler.util.realLatMeter(defaultWidth)/2,
            south: lat - eventWrapper.mapHandler.util.realLatMeter(defaultWidth)/2,
            east: lng + eventWrapper.mapHandler.util.realLngMeter(defaultWidth)/2,
            west: lng - eventWrapper.mapHandler.util.realLngMeter(defaultWidth)/2
        };

        eventWrapper.area = new google.maps.Rectangle({
            bounds: bounds,
            editable: true,
            draggable : true,
            strokeColor : "#003d99",
            getWidth : function(){
                var bounds = this.bounds
                return eventWrapper.mapHandler.util.distanceTo(bounds.f.f,bounds.b.f ,bounds.f.f ,bounds.b.b )
            },
            getHeight : function(){
                bounds = this.bounds
                return eventWrapper.mapHandler.util.distanceTo(bounds.f.f,bounds.b.f ,bounds.f.b ,bounds.b.f )
            }
        });
        eventWrapper.area.setMap(eventWrapper.mapHandler.map)
    }, eventWrapper = this); // dblclick  
  }// end
  