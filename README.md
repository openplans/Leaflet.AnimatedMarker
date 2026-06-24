# Leaflet Animated Marker

[![npm version](https://img.shields.io/npm/v/leaflet.animatedmarker.svg)](https://www.npmjs.com/package/leaflet.animatedmarker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Leaflet plugin for animating a marker along a polyline.

Check out the [demo](http://openplans.github.com/Leaflet.AnimatedMarker/).

## Requirements

- Leaflet ^1.0.0

## Installation

### npm

```bash
npm install leaflet.animatedmarker
```

### CDN

```html
<script src="https://unpkg.com/leaflet.animatedmarker/src/AnimatedMarker.js"></script>
```

## Usage

### Basic

```javascript
const line = L.polyline([
  [40.68510, -73.94136],
  [40.68576, -73.94149],
  [40.68649, -73.94165]
]);

const animatedMarker = L.animatedMarker(line.getLatLngs());
map.addLayer(animatedMarker);
```

### With ES Modules

```javascript
import L from 'leaflet';
import 'leaflet.animatedmarker';

const animatedMarker = L.animatedMarker(line.getLatLngs());
```

### TypeScript

TypeScript definitions are included. The module augments Leaflet's types:

```typescript
import L from 'leaflet';
import 'leaflet.animatedmarker';

const marker: L.AnimatedMarker = L.animatedMarker(line.getLatLngs(), {
  distance: 300,
  interval: 2000,
  autoStart: false,
  onEnd: () => console.log('Animation complete!')
});
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `distance` | `number` | `200` | Distance in meters to travel per interval |
| `interval` | `number` | `1000` | Time in milliseconds to travel the distance |
| `autoStart` | `boolean` | `true` | Start animating immediately when added to the map |
| `onEnd` | `function` | `() => {}` | Callback when animation reaches the end |

Plus all standard [Leaflet Marker options](https://leafletjs.com/reference.html#marker-option).

## Methods

### `start()`

Start the animation from the beginning.

```javascript
animatedMarker.start();
```

### `stop()`

Stop the animation at the current position.

```javascript
animatedMarker.stop();
```

### `setLine(latlngs)`

Set a new path for the marker to follow.

```javascript
animatedMarker.setLine(newPolyline.getLatLngs());
```

## Examples

### Custom Speed

```javascript
const animatedMarker = L.animatedMarker(line.getLatLngs(), {
  distance: 300,  // meters
  interval: 2000  // milliseconds
});
```

### Manual Control

```javascript
const animatedMarker = L.animatedMarker(line.getLatLngs(), {
  autoStart: false
});

// Start when ready
animatedMarker.start();

// Stop after 5 seconds
setTimeout(() => {
  animatedMarker.stop();
}, 5000);
```

### Custom Icon

```javascript
const myIcon = L.icon({
  iconUrl: 'myicon.png'
});

const animatedMarker = L.animatedMarker(line.getLatLngs(), {
  icon: myIcon
});
```

### Callback on Complete

```javascript
const animatedMarker = L.animatedMarker(line.getLatLngs(), {
  onEnd: function() {
    console.log('Animation finished!');
    map.removeLayer(this);
  }
});
```

## Development

### Install dependencies

```bash
npm install
```

### Run tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

## Changelog

### 1.1.0

- **Fixed:** Marker no longer floats to new position when zooming during animation
- **Added:** TypeScript type definitions
- **Added:** UMD module support (AMD, CommonJS, browser globals)
- **Added:** Vitest test suite
- **Changed:** Modernized to ES6 syntax
- **Changed:** Renamed `clickable` option to `interactive` (Leaflet 1.x naming)
- **Removed:** Legacy fallback for browsers without CSS3 transitions
- **Removed:** Bower support (deprecated)

### 1.0.0

- Initial release

## License

MIT License - [OpenPlans](https://www.openplans.org/)
