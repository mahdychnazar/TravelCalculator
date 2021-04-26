var destinationInfo = null;

var Flights = require("./Flights");

var Templates = require('../Templates');
var $hotelsList = $("#hotelsList");

var $yourHotel = $("#yourHotel");



/*var checkInDate = new Date();
var checkOutDate = new Date();*/


function getHotels(checkInDate, checkOutDate, destinationID, amount){
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://hotels4.p.rapidapi.com/properties/list?destinationId="+destinationID+"&pageNumber=1&checkIn=" + checkInDate + "&checkOut="+checkOutDate+"&pageSize=" + amount + "&adults1=1&currency=UAH&locale=uk-UA&sortOrder=PRICE",
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
         if(response.suggestions[0].entities.length != 0){
             destinationInfo = response.suggestions[0].entities[0];
             var hotelsNumber = $('#hotelsNum').val();
             getHotels(startDate, finishDate, destinationInfo.destinationId, hotelsNumber);
         }
         else{
             $hotelsList.html("готелі не знайдено");
         }

    });
}

function showHotels(hotelsInfo){
    $hotelsList.html("");
    for(let i = 0; i < hotelsInfo.length; i++) {

        showOneHotel(hotelsInfo[i]);
    }

}
function showOneHotel(oneHotelInfo){
    var html_code = Templates.HotelTamplate({hotel: oneHotelInfo});
    var $node = $(html_code);
    $node.find(".chooseHotel").click(function(){
        chooseHotel(oneHotelInfo);
    });
    $hotelsList.append($node);
}

function chooseHotel(oneHotelInfo){
    $yourHotel.html("");
    var html_code = Templates.HotelTamplate({hotel: oneHotelInfo});
    var $node = $(html_code);
    $yourHotel.append($node);
    $node.find(".chooseHotel").click(function(){
        $yourHotel.html("");
        Flights.getSum();
    });
    Flights.getSum();
}
function getPrice(oneHotelInfo){
    var Days = Math.floor((new Date(finishDate).getTime() - new Date(startDate).getTime())/(1000*60*60*24));

    return +(+oneHotelInfo.ratePlan.price.current.split(' ')[0] * +Days);
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