/**
 * Created by chaika on 02.02.16.
 */
var fs = require('fs');
var ejs = require('ejs');

exports.FlightTamplate = ejs.compile(fs.readFileSync('./Frontend/templates/FlightTemplate.ejs', "utf8"));