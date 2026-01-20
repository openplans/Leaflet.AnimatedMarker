import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import L from 'leaflet';
import '../src/AnimatedMarker.js';

describe('AnimatedMarker', () => {
  let map;
  let container;

  beforeEach(() => {
    // Create a container for the map
    container = document.createElement('div');
    container.style.width = '500px';
    container.style.height = '500px';
    document.body.appendChild(container);

    // Create a map
    map = L.map(container, {
      center: [40.7, -74.0],
      zoom: 13
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    map.remove();
    document.body.removeChild(container);
    vi.useRealTimers();
  });

  const samplePath = [
    L.latLng(40.68510, -73.94136),
    L.latLng(40.68576, -73.94149),
    L.latLng(40.68649, -73.94165),
    L.latLng(40.68722, -73.94178)
  ];

  describe('constructor', () => {
    it('creates a marker at the first latlng position', () => {
      const marker = L.animatedMarker(samplePath);
      const pos = marker.getLatLng();

      expect(pos.lat).toBeCloseTo(samplePath[0].lat, 5);
      expect(pos.lng).toBeCloseTo(samplePath[0].lng, 5);
    });

    it('accepts options', () => {
      const marker = L.animatedMarker(samplePath, {
        distance: 300,
        interval: 2000,
        autoStart: false
      });

      expect(marker.options.distance).toBe(300);
      expect(marker.options.interval).toBe(2000);
      expect(marker.options.autoStart).toBe(false);
    });

    it('has correct default options', () => {
      const marker = L.animatedMarker(samplePath);

      expect(marker.options.distance).toBe(200);
      expect(marker.options.interval).toBe(1000);
      expect(marker.options.autoStart).toBe(true);
      expect(marker.options.interactive).toBe(false);
    });
  });

  describe('setLine', () => {
    it('stores the path correctly', () => {
      const marker = L.animatedMarker(samplePath, { autoStart: false });

      expect(marker._latlngs).toEqual(samplePath);
      expect(marker._i).toBe(0);
    });

    it('can set a new line', () => {
      const marker = L.animatedMarker(samplePath, { autoStart: false });
      const newPath = [
        L.latLng(40.7, -74.0),
        L.latLng(40.8, -74.1)
      ];

      marker.setLine(newPath);

      expect(marker._latlngs).toEqual(newPath);
      expect(marker._i).toBe(0);
    });
  });

  describe('autoStart', () => {
    it('starts animation automatically when added to map with autoStart: true', () => {
      const marker = L.animatedMarker(samplePath, { autoStart: true });
      const animateSpy = vi.spyOn(marker, 'animate');

      marker.addTo(map);

      expect(animateSpy).toHaveBeenCalled();
    });

    it('does not start animation when added to map with autoStart: false', () => {
      const marker = L.animatedMarker(samplePath, { autoStart: false });
      const animateSpy = vi.spyOn(marker, 'animate');

      marker.addTo(map);

      expect(animateSpy).not.toHaveBeenCalled();
    });
  });

  describe('start and stop', () => {
    it('start() begins animation', () => {
      const marker = L.animatedMarker(samplePath, { autoStart: false });
      marker.addTo(map);

      const animateSpy = vi.spyOn(marker, 'animate');
      marker.start();

      expect(animateSpy).toHaveBeenCalled();
    });

    it('stop() halts animation', () => {
      const marker = L.animatedMarker(samplePath, { autoStart: false });
      marker.addTo(map);

      marker.start();
      expect(marker._tid).toBeTruthy();

      marker.stop();
      expect(marker._tid).toBeNull();
    });
  });

  describe('onEnd callback', () => {
    it('fires when animation completes', () => {
      const onEnd = vi.fn();
      const marker = L.animatedMarker(samplePath, {
        autoStart: false,
        onEnd: onEnd,
        distance: 1000,
        interval: 100
      });

      marker.addTo(map);
      marker.start();

      // Fast-forward through all animation steps
      for (let i = 0; i < samplePath.length; i++) {
        vi.advanceTimersByTime(100);
      }

      expect(onEnd).toHaveBeenCalled();
    });

    it('is called with marker as context', () => {
      let context = null;
      const marker = L.animatedMarker(samplePath, {
        autoStart: false,
        onEnd: function () {
          context = this;
        },
        distance: 1000,
        interval: 100
      });

      marker.addTo(map);
      marker.start();

      // Fast-forward through all animation steps
      for (let i = 0; i < samplePath.length; i++) {
        vi.advanceTimersByTime(100);
      }

      expect(context).toBe(marker);
    });
  });

  describe('animation progression', () => {
    it('moves through all waypoints and reaches the end', () => {
      const onEnd = vi.fn();
      const marker = L.animatedMarker(samplePath, {
        autoStart: false,
        distance: 1000,
        interval: 100,
        onEnd: onEnd
      });

      marker.addTo(map);

      // Before starting, index should be 0
      expect(marker._i).toBe(0);

      marker.start();

      // After starting, marker moves to first position and increments _i
      expect(marker._i).toBe(1);

      // Advance time to complete the animation
      // Each step takes ~100ms (simplified due to large distance setting)
      vi.advanceTimersByTime(500);

      // Animation should have completed
      expect(marker._i).toBe(samplePath.length);
      expect(onEnd).toHaveBeenCalled();
    });
  });

  describe('zoom bug fix', () => {
    it('disables transition on zoomstart', () => {
      const marker = L.animatedMarker(samplePath, { autoStart: false });
      marker.addTo(map);

      // Start animation to set up transitions
      marker.start();

      // Simulate zoomstart
      map.fire('zoomstart');

      expect(marker._icon.style.transition).toBe('none');
    });

    it('re-enables transition on zoomend', () => {
      const marker = L.animatedMarker(samplePath, { autoStart: false });
      marker.addTo(map);

      marker.start();
      marker._currentSpeed = 500;

      map.fire('zoomstart');
      map.fire('zoomend');

      expect(marker._icon.style.transition).toContain('500ms');
    });

    it('cleans up zoom listeners on remove', () => {
      const marker = L.animatedMarker(samplePath, { autoStart: false });
      marker.addTo(map);

      const offSpy = vi.spyOn(map, 'off');
      marker.remove();

      expect(offSpy).toHaveBeenCalledWith('zoomstart', marker._disableTransition, marker);
      expect(offSpy).toHaveBeenCalledWith('zoomend', marker._enableTransition, marker);
    });
  });

  describe('factory function', () => {
    it('L.animatedMarker creates an AnimatedMarker instance', () => {
      const marker = L.animatedMarker(samplePath);

      expect(marker).toBeInstanceOf(L.AnimatedMarker);
      expect(marker).toBeInstanceOf(L.Marker);
    });
  });
});
