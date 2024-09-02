export const getDistanceByLatLong = (lat1, lon1, lat2, lon2, unit) => {
    let dist = null;
    try {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            let radlat1 = Math.PI * lat1/180;
            let radlat2 = Math.PI * lat2/180;
            let theta = lon1-lon2;
            let radtheta = Math.PI * theta/180;
            dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit=="K") { dist = dist * 1.609344 }
            if (unit=="N") { dist = dist * 0.8684 }
        }
    } catch (err) {
        console.error("Error in getDistanceByLatLong--", err);
    }
    return dist;
}

export const getDistance = (lat1, lon1, lat2, lon2, unit = 'm') => {
    let distance = null;
    try {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        // Radius of the earth in meters
        const radius = 6371000;

        // Convert latitude and longitude to radians
        const [radLat1, radLon1, radLat2, radLon2] = [
            lat1, lon1, lat2, lon2
        ].map(coord => (coord * Math.PI) / 180);

        // Haversine formula to calculate distance
        const dlat = radLat2 - radLat1;
        const dlon = radLon2 - radLon1;
        const a = Math.sin(dlat / 2) ** 2 +
            Math.cos(radLat1) * Math.cos(radLat2) *
            Math.sin(dlon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        distance = radius * c;

        // Convert to desired unit
        switch (unit) {
            case 'km':
                distance /= 1000;
                break;
            case 'ft':
                distance *= 3.28084;
                break;
            case 'mi':
                distance /= 1609.344;
                break;
            default:
            // Default is meters, do nothing
        }
    } catch (err) {
        console.error("Error in getDistance--", err);
    }
    return distance;
}