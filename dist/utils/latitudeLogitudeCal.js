"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.latitudeLongitudeCal = void 0;
var latitudeLongitudeCal = function (distanceKm, bearingDegrees) {
    var initialLatitude = 0; // Initial latitude at the equator
    var initialLongitude = 0; // Assuming initial longitude (e.g., prime meridian)
    var earthRadiusKm = 6371; // Radius of the Earth in kilometers
    // Convert distance from kilometers to degrees (approximation)
    var distanceDegrees = distanceKm / earthRadiusKm * (180 / Math.PI);
    // Convert bearing from degrees to radians
    var bearingRadians = bearingDegrees * Math.PI / 180;
    // Convert initial latitude and longitude from degrees to radians
    var lat1 = initialLatitude * Math.PI / 180;
    var lon1 = initialLongitude * Math.PI / 180;
    // Calculate new latitude
    var lat2 = Math.asin(Math.sin(lat1) * Math.cos(distanceDegrees) +
        Math.cos(lat1) * Math.sin(distanceDegrees) * Math.cos(bearingRadians));
    // Calculate new longitude
    var lon2 = lon1 + Math.atan2(Math.sin(bearingRadians) * Math.sin(distanceDegrees) * Math.cos(lat1), Math.cos(distanceDegrees) - Math.sin(lat1) * Math.sin(lat2));
    // Convert new latitude and longitude from radians to degrees
    var newLatitude = lat2 * 180 / Math.PI;
    var newLongitude = lon2 * 180 / Math.PI;
    return { latitude: newLatitude, longitude: newLongitude };
};
exports.latitudeLongitudeCal = latitudeLongitudeCal;
