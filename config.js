var otp = otp || {};
otp.config = {
    tileUrl : 'http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-light/{z}/{x}/{y}.png',
    overlayTileUrl : 'http://{s}.tiles.mapbox.com/v3/intertwine.nyc_bike_overlay/{z}/{x}/{y}.png',
    tileAttrib : 'Routing powered by <a href="http://opentripplanner.org/">OpenTripPlanner</a>, Map tiles &copy; Development Seed and OpenStreetMap ',
    initLatLng : new L.LatLng(40.719298,-73.999743), // NYC
    initZoom : 14,
    minZoom : 13,
    maxZoom : 17
};