var Flights = require("./flights/Flights");
var Forms = require("./Forms");


$(function() {
    Flights.initialize();
    Forms.initialize();
    $(document).ready(function () {
        var todaysDate = new Date();
        var year = todaysDate.getFullYear();
        var month = ("0" + (todaysDate.getMonth() + 1)).slice(-2);
        var day = ("0" + todaysDate.getDate()).slice(-2);
        var minDate = (year +"-"+ month +"-"+ day);
        $('#firstDate').attr('min',minDate);
        startDate = minDate;
        $('#secondDate').attr('min',minDate);
        finishDate = minDate;
    });
});``


