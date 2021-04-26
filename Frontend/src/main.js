var Flights = require("./flights/Flights");
var Hotels = require("./flights/Hotels");
var Forms = require("./Forms");
var Maps = require("./flights/Maps");



$(function() {
    Flights.initialize();
    Forms.initialize();
    Hotels.initialize();
    Maps.initialize();

});


