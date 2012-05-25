(function(){
  var BikeIcon = L.Icon.extend({
      iconUrl: 'http://cibi.me/images/marker-bike-green-shadowed.png',
      iconSize: new L.Point(25, 39),
      shadowUrl: null
  });

  var bikeIcon = new BikeIcon(),
      map = new L.Map('map', {minZoom: otp.config.minZoom, maxZoom: otp.config.maxZoom}),
      tileLayer = new L.TileLayer(otp.config.tileUrl, {attribution: otp.config.tileAttrib});

  if(otp.config.getTileUrl) {
    tileLayer.getTileUrl = otp.config.getTileUrl;
  }

  map.setView(otp.config.initLatLng, otp.config.initZoom).addLayer(tileLayer);

  if(otp.config.overlayTileUrl) {
  var overlayTileLayer = new L.TileLayer(otp.config.overlayTileUrl);
    map.addLayer(overlayTileLayer);
  }

  var url = 'http://cibi-xl2.deployer.opentripplanner.org/opentripplanner-api-webapp/ws/plan';
  function getPlan(data) {
    $.ajax(url, {
      data: data,
      dataType: 'jsonp',
      success: function(data) {
        var itin,
            polyline,
            marker;

        if(data.plan && data.plan.itineraries && data.plan.itineraries.length) {
          itin = data.plan.itineraries[0];
          if (itin.legs.length === 1) {
            polyline = new L.EncodedPolyline(itin.legs[0].legGeometry.points);
          } else if (itin.legs.length === 3) {
            polyline = new L.EncodedPolyline(itin.legs[1].legGeometry.points);
          }

          if (polyline._latlngs) {
            marker = new L.AnimatedMarker(polyline._latlngs, {
              icon: bikeIcon,
              autoStart: false,
              onEnd: function() {
                $(this._shadow).fadeOut();
                $(this._icon).fadeOut(3000, function(){
                  map.removeLayer(this);
                });
              }
            });
            map.addLayer(marker);
            $(marker._icon).hide().fadeIn(1000, function(){
              marker.start();
            });
          }
        }
        else {
          console.log('wah wah waaaahhhh');
        }
      }
    });
  }

  function getRecent(callback) {
    // Nasty global for demo purposes
    $.each(sample_data, function(i, plan){
      setTimeout(function(){
        callback(plan.data);
      }, 5000 * i);
    });
  }

  getRecent(getPlan);
})();