var pointMarker = null;
var html_element = document.getElementById("map");

var mapProp = {
    center: new google.maps.LatLng(50.072, 14.4724),
    zoom: 5
};
var map = new google.maps.Map(html_element, mapProp);
if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            const marker = new google.maps.Marker({
                position: pos,
                map: map,
            });
                geocodeLatLng(pos, function (err, address) {
                if (err === null) {
                    $("#departure").val(address);
                }
            });

        },
        () => {
            //TODO
        }
    );

}
function geocodeLatLng(latlng, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': latlng}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
            var address;
            results.forEach(function(element){
                element.address_components.forEach(function(element2){
                    element2.types.forEach(function(element3) {
                        if (element3 === 'locality') {
                            address = element2.long_name;
                        }
                    })
                })
            });
            callback(null, address);
        } else {
            callback(new Error("Can't find address"));
        }
    });
}

function getCityName(results, address){
    for (var i = 0; i < data.results[4].address_components.length; i++) {
        for (var j = 0; j < data.results[4].address_components[i].types.length; j++) {
            if(data.results[4].address_components[i].types[j] == 'locality') {
                address = data.results[4].address_components[i].long_name;
            }
        }
    }
}
function geocodeAddress(address,  callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK&& results[0])  {
            var coordinates = results[0].geometry.location;;
            callback(null, coordinates);
        } else {
            callback(new Error("Can not find the adress"));
        }
    });
}

function findAddress(err, coordinates) {
    if (err === null){
        geocodeLatLng(coordinates, function (err, address) {
            if (err === null) {
                if (pointMarker !== null){
                    pointMarker.setMap(null);
                }
                pointMarker = new google.maps.Marker({
                    position: coordinates,
                    map: map,
                });
                $("#arrival").val(address);
            }
        });
    }
}

$("#calcButton").click(function (){
    var addr = $("#arrival").val();
    geocodeAddress(addr, findAddress);
});