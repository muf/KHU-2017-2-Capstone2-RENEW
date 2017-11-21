var app
function initRegisterPage(){
    app = new mapEventWrapper(baseMapHandler)
}

function selectArea(){
    console.log("selectArea")
    var width = app.area.getWidth()
    var height = app.area.getHeight()
    var area = width * height
    var geocoder = new google.maps.Geocoder();
    var center = {
        lat: (app.area.bounds.f.b + app.area.bounds.f.f)/2,
        lng: (app.area.bounds.b.b + app.area.bounds.b.f)/2
    }
    var latlng = new google.maps.LatLng(center.lat, center.lng)
    var location = ""
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
            console.log(results)
            location = results[1].formatted_address

            $('textarea#areaInfo-pos').val(location + " 근처 ")
            $('textarea#areaInfo-size').val("너비   :  " + width + " (m)\n높이   :  " + height + " (m)")
            $('textarea#areaInfo-area').val(area + " (제곱미터)\n "+ (app.mapHandler.util.toPyeongArea(area)) +" (평)")
        }
        else{
            location = " not found "
        }
    })

}
function applyService(){
    console.log("applyService")
    alert("접수 되었습니다.") // db query 날리고 성공하면 접수 ㅇㅋ 하고 종료... 서비스 관리 및 로그인? 이런 건 안 할 예정 
}