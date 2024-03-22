export const latitudeLongitudeCal =  (distanceKm: number, bearingDegrees: number) => {
    const initialLatitude = 0; // Initial latitude at the equator
    const initialLongitude = 0; // Assuming initial longitude (e.g., prime meridian)
    
    const earthRadiusKm = 6371; // Radius of the Earth in kilometers

    // Convert distance from kilometers to degrees (approximation)
    const distanceDegrees = distanceKm / earthRadiusKm * (180 / Math.PI);

    // Convert bearing from degrees to radians
    const bearingRadians = bearingDegrees * Math.PI / 180;

    // Convert initial latitude and longitude from degrees to radians
    const lat1 = initialLatitude * Math.PI / 180;
    const lon1 = initialLongitude * Math.PI / 180;

    // Calculate new latitude
    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distanceDegrees) +
                    Math.cos(lat1) * Math.sin(distanceDegrees) * Math.cos(bearingRadians));

    // Calculate new longitude
    const lon2 = lon1 + Math.atan2(Math.sin(bearingRadians) * Math.sin(distanceDegrees) * Math.cos(lat1),
                         Math.cos(distanceDegrees) - Math.sin(lat1) * Math.sin(lat2));

    // Convert new latitude and longitude from radians to degrees
    const newLatitude = lat2 * 180 / Math.PI;
    const newLongitude = lon2 * 180 / Math.PI;

    return { latitude: newLatitude, longitude: newLongitude };
}