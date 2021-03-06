var addressFrom;
var addressTo;

var cityFromID = null;
var cityToID = null;


var startDate = new Date();
var finishDate = new Date();

var Templates = require('../Templates');
var Maps = require("./Maps");
var $flightsList = $("#flightsList");
var $backFlightList = $("#backFlightsList");

var $yourFlights = $("#yourFlight");
var $yourBackFlights = $("#yourBackFlight");
var $yourHotel = $("#yourHotel");




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
        if(response.Places.length != 0) {
            cityFromID = response.Places[0].PlaceId;
            $("#departure-error").removeClass("invalid-feedback");
            $("#departure-error").addClass("valid-feedback");
            console.log(cityFromID);
        }
        else{
            $flightsList.html("Авіарейси не знайдено...");
            $backFlightList.html("Авіарейси не знайдено...");
            $("#departure-error").removeClass("valid-feedback");
            $("#departure-error").addClass("invalid-feedback");
            $("#departure").removeClass("is-valid");
            $("#departure").addClass("is-invalid");
        }
            const settings = {
                "async": true,
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
                if(response.Places.length !== 0) {
                    cityToID = response.Places[0].PlaceId;
                    $("#arrival-error").removeClass("invalid-feedback");
                    $("#arrival-error").addClass("valid-feedback");
                    console.log(cityToID);
                    if(cityFromID != null && cityToID != null) {
                        getFlights(cityFromID, cityToID, startDate, $flightsList);
                        if (document.getElementById("backFlightCheck").checked) {
                            getFlights(cityToID, cityFromID, finishDate, $backFlightList);
                        }
                    }
                }
                else{
                    $flightsList.html("Авіарейси не знайдено...");
                    $backFlightList.html("Авіарейси не знайдено...");
                    $("#arrival-error").removeClass("valid-feedback");
                    $("#arrival-error").addClass("invalid-feedback");
                    $("#arrival").removeClass("is-valid");
                    $("#arrival").addClass("is-invalid");
                }


            });
    })

}


function getFlights(placeFrom, placeTo, departureDate, htmlEl){
    const settings = {
        "async": true,
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
        if(response.Quotes.length != 0){
            showFlights(flightInfo(response),htmlEl);
        }
        else{
            htmlEl.html("Авіарейси не знайдено...");
        }

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
            //isBack: false,

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
function showFlights(flightInfo, htmlEl){
    htmlEl.html("");
    for(let i = 0; i < flightInfo.length; i++) {
        showOneFlight(flightInfo[i], htmlEl);

    }

}
function showOneFlight(oneFlightInfo, htmlEl){
    var html_code = Templates.FlightTamplate({flight: oneFlightInfo});
    var $node = $(html_code);
    //htmlEl.append($node);
    $node.find(".chooseFlight").click(function () {
        if(htmlEl == $flightsList){
            chooseFlight(oneFlightInfo);
        }
        else{
            chooseBackFlight(oneFlightInfo);
        }

    });
    htmlEl.append($node);
}
function chooseFlight(oneFlightInfo){
    document.getElementById('summary').hidden = false;
    document.getElementById('sum').hidden = false;
    document.getElementById('sum1').hidden = false;
    $yourFlights.html("");
    var html_code = Templates.FlightTamplate({flight: oneFlightInfo});
    var $node = $(html_code);
        $yourFlights.append($node);
    $node.find(".chooseFlight").click(function(){
        $yourFlights.html("");
        getSum()

    });
    getSum();
    Maps.visualizeFlight();

}
function chooseBackFlight(oneFlightInfo){
    document.getElementById('summary').hidden = false;
    document.getElementById('sum').hidden = false;
    document.getElementById('sum1').hidden = false;
    $yourBackFlights.html("");
    var html_code = Templates.FlightTamplate({flight: oneFlightInfo});
    var $node = $(html_code);
    $yourBackFlights.append($node);
    $node.find(".chooseFlight").click(function(){
        $yourBackFlights.html("");
        getSum()
    });
    getSum();
    Maps.visualizeFlight();

}

function getSum(){
    let totalSum = 0;
    if($yourFlights.find(".price").length != 0){
        totalSum += Number($yourFlights.find(".price")[0].firstChild.data);
    }
    if($yourBackFlights.find(".price").length != 0){
        totalSum += Number($yourBackFlights.find(".price")[0].firstChild.data);
    }
    if($yourHotel.find(".price").length!=0){
        var Days = Math.floor((new Date(finishDate).getTime() - new Date(startDate).getTime())/(1000*60*60*24));
        totalSum += Days * Number(($yourHotel.find(".price")[0].firstChild.data));

    }
    console.log(totalSum);
    document.getElementById("sum").innerHTML = totalSum;
}



function initialize() {
    $("#calcButton").click(function () {
        Maps.initialize();
        document.getElementById('flightsList').hidden = false;
        document.getElementById('backFlightsList').hidden = false;
        document.getElementById('hotelsList').hidden = false;
        document.getElementById('myTrip').hidden = false;
        document.getElementById('flight').hidden = false;
        document.getElementById('hotel').hidden = false;
        $flightsList.html("Шукаю авіарейси...");

        cityToID = null;
        cityFromID = null;

        addressTo = $("#arrival").val();
        addressFrom = $("#departure").val();
        startDate = $("#firstDate").val();
        finishDate = $("#secondDate").val();
         if(document.getElementById("backFlightCheck").checked){
             document.getElementById('flightBack').hidden = false;
             $backFlightList.html("Шукаю авіарейси...");
         }
         else{
             $backFlightList.html("");
         }
        $flightsList.html("Шукаю авіарейси...");

        getPlaceID(addressFrom, addressTo, startDate, $flightsList);
    });
}
exports.initialize = initialize;
exports.getSum = getSum;
