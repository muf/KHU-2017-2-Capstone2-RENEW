var app
function initRegisterPage(){
    app = new mapEventWrapper(baseMapHandler)
}

function selectArea(){
    console.log("selectArea")
    console.log("applyService")
    if(app.area === null){
        alert("지도를 더블 클릭하여 서비스 영역을 지정해 주세요.")
        return 
    }
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
    var data;
    if(app.area === null){
        alert("먼저 서비스 영역을 선택해 주세요.")
        return 
    }
    else if($('#service-start-date').data("DateTimePicker").date() === null){
        alert("서비스 시작 시점을 선택해 주세요.")
        return 
    }
    else if($('#service-end-date').data("DateTimePicker").date() === null){
        alert("서비스 종료 시점을 선택해 주세요.")
        return 
    }
    else if($('#email').val()=="" && $('#contact-number').val()===""){
        alert("연락처를 하나 이상 입력해 주세요.")
        return 
    }
    var serviceStartDate = $('#service-start-date').data("DateTimePicker").date()._d
    var serviceEndDate = $('#service-end-date').data("DateTimePicker").date()._d
    // @@@ 여기 좀 바꿔야함..
    var droneMin = $('#drone-min').val()
    var droneMax = $('#drone-max').val()
    // 값이 정상적이지 않은 경우 교정 진행
    if(droneMax < droneMin){
        var temp = droneMin
        droneMin = droneMax
        droneMax = temp
    }
    if(serviceStartDate > serviceEndDate){
        var temp = serviceStartDate
        serviceStartDate = serviceEndDate
        serviceEndDate = temp
    }
    if(serviceStartDate < new Date()){
        alert("시작 날짜가 유효하지 않습니다.")
        return 
    }
    else if( serviceEndDate - serviceStartDate < 3500000){
        alert("서비스는 최소 1시간 이상 이용해야 합니다.")
        return 
    }

    var email = $('#email').val()
    var contactNumber = $('#contact-number').val()
    var bounds = {
        min:{
            lat : app.area.bounds.f.b,
            lng : app.area.bounds.b.b,
        },
        max:{
            lat : app.area.bounds.f.f,
            lng : app.area.bounds.b.f,
        }
    }
    
    $.ajax({
        url : "http://localhost:3002/createServiceApplication",
        type: "POST",
        data : {
            serviceStartDate:serviceStartDate,
            serviceEndDate:serviceEndDate,
            droneMin:droneMin,
            droneMax:droneMax,
            email:email,
            contactNumber:contactNumber,
            bounds : bounds
        },
        success: function(data, textStatus, jqXHR)
        {
            //data - response from server
            alert("접수 되었습니다.") // db query 날리고 성공하면 접수 ㅇㅋ 하고 종료... 서비스 관리 및 로그인? 이런 건 안 할 예정 
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            alert("실패하였습니다.")
        }
    });
}