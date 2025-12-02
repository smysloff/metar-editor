
// src/components/metar/metar.mjs

import  typeComponent         from  './metar/type/type.mjs'
import  icaoComponent         from  './metar/icao/icao.mjs'
import  corComponent          from  './metar/cor/cor.mjs'
import  datetimeComponent     from  './metar/datetime/datetime.mjs'
import  nilComponent          from  './metar/nil/nil.mjs'
import  autoComponent         from  './metar/auto/auto.mjs'
import  windComponent         from  './metar/wind/wind.mjs'
import  cavokComponent        from  './metar/cavok/cavok.mjs'
import  visibilityComponent   from  './metar/visibility/visibility.mjs'
import  weatherComponent      from  './metar/weather/weather.mjs'
import  cloudsComponent       from  './metar/clouds/clouds.mjs'
import  temperatureComponent  from  './metar/temperature/temperature.mjs'
import  pressureComponent     from  './metar/pressure/pressure.mjs'
import  trendComponent        from  './metar/trend/trend.mjs'

import  mainComponent         from  './metar/main/main.mjs'

export default {
  type:        typeComponent,
  icao:        icaoComponent,
  cor:         corComponent,
  datetime:    datetimeComponent,
  nil:         nilComponent,
  auto:        autoComponent,
  wind:        windComponent,
  cavok:       cavokComponent,
  visibility:  visibilityComponent,
  weather:     weatherComponent,
  clouds:      cloudsComponent,
  temperature: temperatureComponent,
  pressure:    pressureComponent,
  trend:       trendComponent,

  main:        mainComponent,
}
