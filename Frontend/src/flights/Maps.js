var html_element = document.getElementById("map");

var colorTo = "#ff0000";
var colorBack = "#00ff00"
var $yourFlights = $("#yourFlight");
var $yourBackFlights = $("#yourBackFlight");
var $yourHotel = $("#yourHotel");

var map;

function visualizeFlight(){
    var departurePoint = null;
    var arrivalPoint = null;
    if($yourFlights.find(".origin").length != 0 && $yourFlights.find(".destination").length != 0){
        departurePoint= $yourFlights.find(".origin")[0].firstChild.data;
        arrivalPoint = $yourFlights.find(".destination")[0].firstChild.data;
        console.log(departurePoint);
        console.log(arrivalPoint);
        geocodeAirportAddress(departurePoint, arrivalPoint, colorTo);
    }
    if($yourBackFlights.find(".origin").length != 0 && $yourBackFlights.find(".destination").length != 0){
        departurePoint= $yourBackFlights.find(".origin")[0].firstChild.data;
        arrivalPoint = $yourBackFlights.find(".destination")[0].firstChild.data;
        console.log(departurePoint);
        console.log(arrivalPoint);
        geocodeAirportAddress(departurePoint, arrivalPoint, colorBack);
    }
    /*if($yourHotel.find(".price").length !=0){
        departurePoint = $yourFlights.find(".destination")[0].firstChild.data;
        arrivalPoint = $yourHotel.find(".name")[0].firstChild.data;
        calculateRoute(departurePoint, arrivalPoint);
    }*/
}

function geocodeAirportAddress(address1, address2, color) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address1 }, function (results, status) {
        temp = results[0].geometry.location;
        geocoder.geocode({ 'address': address2 }, function (results, status) {
            temp2 = results[0].geometry.location;
            map.setCenter(results[0].geometry.location);
            new google.maps.Marker({
                position: temp,
                map: map,
                icon:"../www/assets/images/takeoff.png",
            });
            new google.maps.Marker({
                position: temp2,
                map: map,
                icon:"../www/assets/images/landing.png",
            });


            var route = [
                temp,
                temp2
            ];

            var polyline = new google.maps.Polyline({
                geodesic: true,
                path: route,
                strokeColor: color,
                strokeOpacity: 0.6,
                strokeWeight: 5
            });

            polyline.setMap(map);
        });
    });
}


function initialize(){

    var mapProp = {
        center: new google.maps.LatLng(50.072, 14.4724),
        zoom: 5
    };
    map = new google.maps.Map(html_element, mapProp);
}
exports.initialize = initialize;
exports.visualizeFlight = visualizeFlight;