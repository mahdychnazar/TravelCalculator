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



function getPlaceID(city){
    const settings = {
        "async": false,
        "crossDomain": true,
        "url": "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/UA/UAH/uk-UA/?query=" + city,
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "52beb59b4amsh61bab5abc3639c7p1ff0c7jsn49006181c3b2",
            "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com"
        }
    };

    return $.ajax(settings).done(function (response) {
        return response;

    });
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

    return $.ajax(settings).done(function (response) {
        return response;
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

function initialize() {




    $("#calcButton").click(function () {
        addressTo = $("#arrival").val();
        addressFrom = $("#departure").val();
        startDate = $("#firstDate").val();

        places = getPlaceID(addressFrom).responseJSON;
        //console.log(places);
        if(places.length !== 0){
            cityFromID = places.Places[0].CityId;
            countryFromID = places.Places[0].CountryId;
        }
        else{
            $("#departure-error").removeClass("valid-feedback");
            $("#departure-error").addClass("invalid-feedback");
        }

        places = getPlaceID(addressTo).responseJSON;
        console.log(places);
        if(Places.length !== 0) {
            cityToID = places.Places[0].CityId;
            countryToID = places.Places[0].CountryId;
        }
        else{

        }
        console.log(cityToID);
        console.log(cityFromID);

       /* if(cityToID !== null && cityFromID !== null){

        }*/
        flights = getFlights(cityFromID, cityToID, startDate).responseJSON;



       /* console.log(cityFromID);
        console.log(countryFromID);
        console.log(cityToID);
        console.log(countryToID);
        console.log(flights);*/

       // console.log(flightInfo(flights));
        showFlights(flightInfo(flights));
    });
}
exports.initialize = initialize;