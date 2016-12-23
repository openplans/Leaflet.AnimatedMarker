# Leaflet Animated Marker
[![CDNJS](https://img.shields.io/cdnjs/v/leaflet.AnimatedMarker.svg)](https://cdnjs.com/libraries/leaflet.AnimatedMarker)

This is a Leaflet plugin for animating a marker along a polyline. Check out the [demo](http://openplans.github.com/Leaflet.AnimatedMarker/). Feedback appreciated!

## How does it work?

It uses CSS3 animations to move the marker from point to point at a specific rate (meter per millisecond). For ancient browsers that don't support CSS3, the polyline is chunked into `distance` segments and moved per `interval` (not so great).

## How can I use it?

The following code will create an AnimatedMarker that moves along `line`, assuming a `Leaflet.Map` called `map`.

    var line = L.polyline([[40.68510, -73.94136],[40.68576, -73.94149],[40.68649, -73.94165]]),
        animatedMarker = L.animatedMarker(line.getLatLngs());

    map.addLayer(animatedMarker);

## How do I change the rate?

    var animatedMarker = L.animatedMarker(line.getLatLngs(), {
      distance: 300,  // meters
      interval: 2000, // milliseconds
    });


## What if I don't want it to animate right away? Or need to stop it halfway through?

    var animatedMarker = L.animatedMarker(line.getLatLngs(), {
      autoStart: false
    });

    // Start when you're ready
    animatedMarker.start();

    setTimeout(function() {
      // Stop the animation
      animatedMarker.stop();
    }, 2000);

## Can I give it a custom icon?

Yep! Just like a standard Leaflet.Marker layer.

    var myIcon = L.icon({
      iconUrl: 'myicon.png'
    });

    var animatedMarker = L.animatedMarker(line.getLatLngs(), {
      icon: myIcon
    });

## Can I make the marker explode when it gets to the end of the line?

Sure! Just use the `onEnd` callback.

    var animatedMarker = L.animatedMarker(line.getLatLngs(), {
      onEnd: function() {
        // TODO: blow up this marker
      }
    });
