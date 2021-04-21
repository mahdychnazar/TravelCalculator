var destinationInfo = null;
var hotelsInfo = [];

var Templates = require('../Templates');
var $hotelsList = $("#hotelsList");
/*var checkInDate = new Date();
var checkOutDate = new Date();*/


function getHotels(checkInDate, checkOutDate, destinationID){
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://hotels4.p.rapidapi.com/properties/list?destinationId="+destinationID+"&pageNumber=1&checkIn=" + checkInDate + "&checkOut="+checkOutDate+"&pageSize=25&adults1=1&currency=UAH&locale=uk-UA&sortOrder=PRICE",
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "52beb59b4amsh61bab5abc3639c7p1ff0c7jsn49006181c3b2",
            "x-rapidapi-host": "hotels4.p.rapidapi.com"
        }
    };

    $.ajax(settings).done(function (response) {
         console.log(response);
         showHotels(response.data.body.searchResults.results);
    });
}
function getDestinationID(place, startDate, finishDate){
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://hotels-com-provider.p.rapidapi.com/v1/destinations/search?locale=uk_UA&currency=UAH&query="+place,
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "52beb59b4amsh61bab5abc3639c7p1ff0c7jsn49006181c3b2",
            "x-rapidapi-host": "hotels-com-provider.p.rapidapi.com"
        }
    };

    $.ajax(settings).done(function (response) {
         console.log(response);
        destinationInfo = response.suggestions[0].entities[0];
        getHotels(startDate, finishDate, destinationInfo.destinationId);

    });
}

function showHotels(hotelsInfo){
    $hotelsList.html("");
    for(let i = 0; i < hotelsInfo.length; i++) {
        var html_code = Templates.HotelTamplate({hotel: hotelsInfo[i]});
        var $node = $(html_code);
        $hotelsList.append($node);
    }

}

function initialize(){
    $("#calcButton").click(function () {
        $hotelsList.html("Шукаю готелі...");
        destinationInfo = null;
        addressTo = $("#arrival").val();
        startDate = $("#firstDate").val();
        finishDate = $("#secondDate").val();
        getDestinationID(addressTo, startDate, finishDate);
    });
}

exports.initialize = initialize;