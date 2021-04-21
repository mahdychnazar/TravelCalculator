var addressFrom;
var addressTo;

var cityFromID = null;
var cityToID = null;

var countryFromID = null;
var countryToID = null;


var places;
var flights;

var startDate = new Date();
var finishDate = new Date();

var Templates = require('../Templates');
var $flightsList = $("#flightsList");



function getPlaceID(addressFrom, addressTo, startDate) {
    const settings = {
        "async": false,
        "crossDomain": true,
        "url": "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/UA/UAH/uk-UA/?query=" + addressFrom,
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "52beb59b4amsh61bab5abc3639c7p1ff0c7jsn49006181c3b2",
            "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com"
        }
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
        cityFromID = response.Places[0].PlaceId;
        console.log(cityFromID);
        const settings = {
            "async": false,
            "crossDomain": true,
            "url": "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/UA/UAH/uk-UA/?query=" + addressTo,
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "52beb59b4amsh61bab5abc3639c7p1ff0c7jsn49006181c3b2",
                "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com"
            }
        };

        $.ajax(settings).done(function (response) {
            console.log(response);
            cityToID = response.Places[0].PlaceId;
            console.log(cityFromID);
            getFlights(cityFromID, cityToID, startDate);


        });
    })
}


function getFlights(placeFrom, placeTo, departureDate){
    const settings = {
        "async": false,
        "crossDomain": true,
        "url": "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/UA/UAH/uk-UA/" + placeFrom + "/" + placeTo + "/" + departureDate,
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "52beb59b4amsh61bab5abc3639c7p1ff0c7jsn49006181c3b2",
            "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com"
        }
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
        showFlights(flightInfo(response));
    });
}
function flightInfo(flights){
    var allFlights = [];
    for(let i = 0; i < flights.Quotes.length; i++){
        allFlights[i] = {
            id: i+1,
            minPrice: flights.Quotes[i].MinPrice,
            carrier: getCarrier(flights, i+1),
            date: flights.Quotes[i].OutboundLeg.DepartureDate,
            origin: getOrigin(flights, i+1),
            destination: getDestination(flights, i+1),

        }

    }
    return allFlights;
}
function getCarrier(flights, QuoteId){
    let carrier;
    for(let i = 0; i < flights.Carriers.length; i++){
        if(flights.Carriers[i].CarrierId === flights.Quotes[QuoteId-1].OutboundLeg.CarrierIds[0]){
            carrier = flights.Carriers[i].Name;
            return carrier;
        }
    }
}
function getOrigin(flights, QuoteId){
    let origin;
    for(let i = 0; i < flights.Places.length; i++){
        if(flights.Quotes[QuoteId-1].OutboundLeg.OriginId === flights.Places[i].PlaceId){
            origin = flights.Places[i].Name;
            return origin;
        }
    }
}
function getDestination(flights, QuoteId){
    let destination;
    for(let i = 0; i < flights.Places.length; i++){
        if(flights.Quotes[QuoteId-1].OutboundLeg.DestinationId === flights.Places[i].PlaceId){
            destination = flights.Places[i].Name;
            return destination;
        }
    }
}
function showFlights(flightInfo){
    $flightsList.html("");
    for(let i = 0; i < flightInfo.length; i++) {
        var html_code = Templates.FlightTamplate({flight: flightInfo[i]});
        var $node = $(html_code);
        $flightsList.append($node);
    }

}
function showNotFount(){
    $flightsList.html("");
}



function initialize() {
    $("#calcButton").click(function () {
        $flightsList.html("Шукаю авіарейси...");
        cityToID = null;
        cityFromID = null;

        addressTo = $("#arrival").val();
        addressFrom = $("#departure").val();
        startDate = $("#firstDate").val();
        finishDate = $("#secondDate").val();

        getPlaceID(addressFrom, addressTo, startDate);
        /*console.log(places);
        if(places.Places.length != 0){
            cityFromID = places.Places[0].CityId;
            countryFromID = places.Places[0].CountryId;
            $("#departure-error").removeClass("invalid-feedback");
            $("#departure-error").addClass("valid-feedback");
        }
        else{
            $("#departure-error").removeClass("valid-feedback");
            $("#departure-error").addClass("invalid-feedback");
            $("#departure").removeClass("is-valid");
            $("#departure").addClass("is-invalid");
        }

        places = getPlaceID(addressTo).responseJSON;
        console.log(places);
        if(places.Places.length !== 0) {
            cityToID = places.Places[0].CityId;
            countryToID = places.Places[0].CountryId;
            $("#arrival-error").removeClass("invalid-feedback");
            $("#arrival-error").addClass("valid-feedback");
        }
        else{
            $("#arrival-error").removeClass("valid-feedback");
            $("#arrival-error").addClass("invalid-feedback");
            $("#arrival").removeClass("is-valid");
            $("#arrival").addClass("is-invalid");
        }
        console.log(cityToID);
        console.log(cityFromID);

        if(cityToID !== null && cityFromID !== null  && !isNaN(new Date(startDate).getTime()) ){
            flights = getFlights(cityFromID, cityToID, startDate).responseJSON;
            showFlights(flightInfo(flights));
        }
        else{
            showNotFount();
        }*/

    });
}
exports.initialize = initialize;