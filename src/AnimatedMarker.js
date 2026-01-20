/**
 * Leaflet.AnimatedMarker
 * Animate a marker along a polyline.
 *
 * https://github.com/openplans/Leaflet.AnimatedMarker
 * License: MIT
 */

(function (factory) {
  // UMD wrapper
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['leaflet'], factory);
  } else if (typeof module !== 'undefined' && module.exports) {
    // Node/CommonJS
    module.exports = factory(require('leaflet'));
  } else {
    // Browser globals
    factory(window.L);
  }
}(function (L) {
  'use strict';

  L.AnimatedMarker = L.Marker.extend({
    options: {
      // meters per interval
      distance: 200,
      // milliseconds
      interval: 1000,
      // animate on add?
      autoStart: true,
      // callback on animation end
      onEnd: function () {},
      // marker is not interactive by default
      interactive: false
    },

    initialize: function (latlngs, options) {
      this.setLine(latlngs);
      L.Marker.prototype.initialize.call(this, latlngs[0], options);
    },

    onAdd: function (map) {
      L.Marker.prototype.onAdd.call(this, map);

      // Disable transition during zoom to prevent marker floating
      this._map.on('zoomstart', this._disableTransition, this);
      this._map.on('zoomend', this._enableTransition, this);

      if (this.options.autoStart) {
        this.start();
      }
    },

    onRemove: function (map) {
      // Clean up zoom event listeners
      this._map.off('zoomstart', this._disableTransition, this);
      this._map.off('zoomend', this._enableTransition, this);

      this.stop();
      L.Marker.prototype.onRemove.call(this, map);
    },

    animate: function () {
      const len = this._latlngs.length;
      let speed = this.options.interval;

      // Normalize the transition speed from vertex to vertex
      if (this._i < len && this._i > 0) {
        speed = this._latlngs[this._i - 1].distanceTo(this._latlngs[this._i]) / this.options.distance * this.options.interval;
      }

      // Store current speed for re-enabling transition after zoom
      this._currentSpeed = speed;

      // Apply CSS transition for smooth animation
      this._setTransition(speed);

      // Move to the next vertex
      this.setLatLng(this._latlngs[this._i]);
      this._i++;

      // Queue up the animation to the next vertex
      this._tid = setTimeout(() => {
        if (this._i === len) {
          this.options.onEnd.call(this);
        } else {
          this.animate();
        }
      }, speed);
    },

    start: function () {
      this._i = 0;
      this.animate();
    },

    stop: function () {
      if (this._tid) {
        clearTimeout(this._tid);
        this._tid = null;
      }
    },

    setLine: function (latlngs) {
      this._latlngs = latlngs;
      this._i = 0;
    },

    _setTransition: function (speed) {
      if (this._icon) {
        this._icon.style.transition = 'all ' + speed + 'ms linear';
      }
      if (this._shadow) {
        this._shadow.style.transition = 'all ' + speed + 'ms linear';
      }
    },

    _disableTransition: function () {
      if (this._icon) {
        this._icon.style.transition = 'none';
      }
      if (this._shadow) {
        this._shadow.style.transition = 'none';
      }
    },

    _enableTransition: function () {
      // Re-enable transition with current animation speed
      if (this._currentSpeed) {
        this._setTransition(this._currentSpeed);
      }
    }
  });

  // Factory function
  L.animatedMarker = function (latlngs, options) {
    return new L.AnimatedMarker(latlngs, options);
  };

  return L.AnimatedMarker;
}));
