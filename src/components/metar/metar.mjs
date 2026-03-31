
// src/components/metar/metar.mjs

import type                from './type/type.mjs'
import icao                from './icao/icao.mjs'
import cor                 from './cor/cor.mjs'
import datetime            from './datetime/datetime.mjs'
import nil                 from './nil/nil.mjs'
import auto                from './auto/auto.mjs'
import wind                from './wind/wind.mjs'
import cavok               from './cavok/cavok.mjs'
import visibility          from './visibility/visibility.mjs'
import visibility_minimal  from './visibility/visibility_minimal.mjs'
import weather             from './weather/weather.mjs'
import visibility_vertical from './visibility/visibility_vertical.mjs'
import clouds              from './clouds/clouds.mjs'
import temperature         from './temperature/temperature.mjs'
import pressure            from './pressure/pressure.mjs'
import trend               from './trend/trend.mjs'

export default {
  type,
  icao,
  cor,
  datetime,
  nil,
  auto,
  wind,
  cavok,
  visibility,
  visibility_minimal,
  weather,
  visibility_vertical,
  clouds,
  temperature,
  pressure,
  trend,
}
