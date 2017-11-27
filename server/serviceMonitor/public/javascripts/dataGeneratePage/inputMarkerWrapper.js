
var inputMarkerWrapper = function(_mapHandler){
    // @ attribute
    _mapHandler.map.wrappers.inputMarkerWrapper = this
    this.markers = []
    this.interval = 0
    this.intervalMin = 0
    this.intervalMax = 0

    this.moveMin = 10
    this.moveMax = 50 // 분당 이동 하는 lat,lng 최댓값 (m)

    this.areaRandom = function(){
        var count = Number($('#area-random').val())
        for(var i = 0; i < count; i++){
            var data = Math.random(i)*200 + 100 // 100 ~ 300
            var lat = Math.random(i)*(service.bounds.max.lat - service.bounds.min.lat) + (service.bounds.min.lat) // min ~ max
            var lng = Math.random(i)*(service.bounds.max.lng - service.bounds.min.lng) + (service.bounds.min.lng) // min ~ max
            var marker = _mapHandler.addMarker(this.markers, lat, lng, {data, lat, lng}, this.markers.length, 0)
            marker.setDraggable(true)
        }
    }
    this.setInterval = function(){
        var interval = Number($('#add-interval').val())
        if(interval != NaN){
            this.interval = interval
            console.log(`interval: ${this.interval}`)
        }
    }
    this.setIntervalMin = function(){
        var intervalMin = Number($('#interval-min').val())
        if(intervalMin != NaN){
            this.intervalMin = intervalMin
            console.log(`interval min : ${this.intervalMin}`)
        }
    }
    this.setIntervalMax = function(){
        var intervalMax = Number($('#interval-max').val())
        if(intervalMax != NaN){
            this.intervalMax = intervalMax
            console.log(`interval max : ${this.intervalMax}`)
        }
    }
    this.moveNode = function(node){
        var data = node.data
        var lat = node.lat
        var lng = node.lng

        var sign = Math.random()*1-0.5 > 0 ? 1 : -1
        
        var newData = data + sign * Math.random()*40 + 10 // 10 ~ 50

        var rlat_sign = Math.random()*1-0.5 > 0 ? 1 : -1
        var rlng_sign = Math.random()*1-0.5 > 0 ? 1 : -1

        var newLat = lat + rlat_sign * _mapHandler.util.realLatMeter(Math.random() * (this.moveMax - this.moveMin) + this.moveMin) // min ~ max
        var newLng = lng + rlng_sign * _mapHandler.util.realLatMeter(Math.random() * (this.moveMax - this.moveMin) + this.moveMin) // 3 ~ 5 m
        
        return {data: newData, lat: newLat, lng: newLng}

    }
    this.addMarker = function(lat, lng){
        var count = this.interval
        for(var i = -1; i < count; i++){
            var data = Math.random(i)*200 + 100 // 100 ~ 300

            if(i != -1){
                var rlat_sign = Math.random()*1-0.5 > 0 ? 1 : -1
                var rlng_sign = Math.random()*1-0.5 > 0 ? 1 : -1

                lat = lat + rlat_sign * _mapHandler.util.realLatMeter(Math.random(i) * (this.intervalMax - this.intervalMin) + this.intervalMin) // min ~ max
                lng = lng + rlng_sign * _mapHandler.util.realLatMeter(Math.random(i) * (this.intervalMax - this.intervalMin) + this.intervalMin) // 3 ~ 5 m
            }
            
            var marker = _mapHandler.addMarker(this.markers, lat, lng, {data, lat, lng}, this.markers.length, 0)
            marker.setDraggable(true)
            google.maps.event.addListener(marker, "rightclick", function(event) {
                _mapHandler.hideMapElement(this)
                console.log("rc")
                var markers = _mapHandler.map.wrappers.inputMarkerWrapper.markers
                var length = markers.length
                for(var i = 0; i < length; i++){
                    if(markers[i] == this){
                        markers.splice(i, 1)
                    }
                }
            });
            google.maps.event.addListener(marker, "mouseup", function(event) {
                console.log("up")
                this.node.lat = this.position.lat()
                this.node.lng = this.position.lng()
            });
        }
    }    
    return _mapHandler
     
  }// end
  
