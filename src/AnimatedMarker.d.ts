import * as L from 'leaflet';

declare module 'leaflet' {
  interface AnimatedMarkerOptions extends MarkerOptions {
    /**
     * Distance in meters to travel per interval.
     * @default 200
     */
    distance?: number;

    /**
     * Time in milliseconds to travel the distance.
     * @default 1000
     */
    interval?: number;

    /**
     * Whether to start animating immediately when added to the map.
     * @default true
     */
    autoStart?: boolean;

    /**
     * Callback function called when the animation reaches the end of the line.
     */
    onEnd?: () => void;
  }

  /**
   * A marker that animates along a polyline path.
   */
  class AnimatedMarker extends Marker {
    constructor(latlngs: LatLngExpression[], options?: AnimatedMarkerOptions);

    /**
     * Start the animation from the beginning.
     */
    start(): void;

    /**
     * Stop the animation at the current position.
     */
    stop(): void;

    /**
     * Set a new line for the marker to animate along.
     * @param latlngs - Array of coordinates defining the path
     */
    setLine(latlngs: LatLngExpression[]): void;
  }

  /**
   * Factory function to create an AnimatedMarker.
   * @param latlngs - Array of coordinates defining the path
   * @param options - Marker options
   */
  function animatedMarker(
    latlngs: LatLngExpression[],
    options?: AnimatedMarkerOptions
  ): AnimatedMarker;
}
