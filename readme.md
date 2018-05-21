# ADDS

[![Build Status][travis-image]][travis-url]
[![NPM Version][npm-image]][npm-url]
[![Coverage][coveralls-image]][coveralls-url]

Javascript client for https://www.aviationweather.gov/ text data server

## Installation

```sh
npm install --save adds
```

## Usage

```js
const ADDS = require('adds')

ADDS('metars', {
  stationString: 'KSEA',
  hoursBeforeNow: 1
})
  .then(metars => {
    console.log(JSON.stringify(metars, null, 2))
  })
```

Output:

```json
[
  {
    "raw_text": "KSEA 202353Z 27005KT 10SM BKN042 19/10 A3004 RMK AO2 SLP176 T01940100 10200 20139 56010 $",
    "station_id": "KSEA",
    "observation_time": "2018-05-20T23:53:00Z",
    "latitude": 47.45,
    "longitude": -122.32,
    "temp_c": 19.4,
    "dewpoint_c": 10,
    "wind_dir_degrees": 270,
    "wind_speed_kt": 5,
    "visibility_statute_mi": 10,
    "altim_in_hg": 30.041338,
    "sea_level_pressure_mb": 1017.6,
    "quality_control_flags": {
      "auto_station": "TRUE",
      "maintenance_indicator_on": "TRUE"
    },
    "sky_condition": {
      "sky_cover": "BKN",
      "cloud_base_ft_agl": 4200
    },
    "flight_category": "VFR",
    "three_hr_pressure_tendency_mb": -1,
    "maxT_c": 20,
    "minT_c": 13.9,
    "metar_type": "METAR",
    "elevation_m": 136
  }
]
```

See [`example.js`](./example.js) for more usage examples.

## API

### `ADDS(dataSource, options)`

#### `dataSource`

Type: `string`

One of the following:

- `metars`
- `tafs`
- `aircraftreports`
- `airsigmets`
- `gairmets`
- `stations`

#### `options`

Type: `object`

These options are passed to ADDS as query parameters. See the [ADDS documentation](https://www.aviationweather.gov/dataserver) for all available options.

## License

MIT © [Forrest Desjardins](https://github.com/fdesjardins)

[travis-url]: https://travis-ci.org/fdesjardins/adds
[travis-image]: https://img.shields.io/travis/fdesjardins/adds.svg?style=flat
[npm-url]: https://www.npmjs.com/package/adds
[npm-image]: https://img.shields.io/npm/v/adds.svg?style=flat
[coveralls-url]: https://coveralls.io/r/fdesjardins/adds
[coveralls-image]: https://img.shields.io/coveralls/fdesjardins/adds.svg?style=flat
