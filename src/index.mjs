
// file: src/index.mjs

import AMTK_ICAOS      from './core/icaos.mjs'
import AMTK_VISIBILITY from './core/visibility.mjs'
import FormManager     from './core/form_manager.mjs'


import metar_type_component        from  './components/metar_type.mjs'
import metar_icao_component        from  './components/metar_icao.mjs'
import metar_datetime_component    from  './components/metar_datetime.mjs'
import metar_wind_component        from  './components/metar_wind.mjs'
import metar_cavok_component       from  './components/metar_cavok.mjs'
import metar_visibility_component  from  './components/metar_visibility.mjs'
import metar_weather_component     from  './components/metar_weather.mjs'
import metar_clouds_component      from  './components/metar_clouds.mjs'
import metar_temperature_component from  './components/metar_temperature.mjs'
import metar_pressure_component    from  './components/metar_pressure.mjs'
import metar_trend_component       from  './components/metar_trend.mjs'


// Правильный порядок логических групп для METAR/SPECI:
//  1. Тип сводки (METAR/SPECI + COR если есть)
//  2. Код аэродрома (ICAO) (4 буквы)
//  3. Дата и время (день + время UTC с Z в конце)
//  4. Ветер (направление/скорость/порывы + единицы измерения + VRB/CALM если есть)
//  5. Видимость (в метрах или км + направление если есть)
//  6. Погодные явления (если есть: -RA, SN, FG и т.д.)
//  7. Облачность (слои + высота + CB/TCU если есть)
//  8. Температура/Точка росы (TT/TdTd с M для минуса)
//  9. Давление (QNH в гПа)
// 10. Дополнительно (NOSIG, CAVOK, RMK и т.д.)

// METAR UUEE 141630Z 03012G20MPS 9999 -SN BKN015CB 03/M01 Q1012 NOSIG=
// ↑     ↑    ↑       ↑           ↑    ↑   ↑        ↑      ↑     ↑
// 1     2    3       4           5    6   7        8      9     10

// Особенности:
// - Если CAVOK (видимость ≥10 км, нет облаков ниже 5000ft, нет опасных явлений):
// -- заменяет группы 5, 6, 7
// - Погодные явления могут быть в любом месте после ветра, но обычно перед облачностью.
// - RVR (видимость на ВПП) идёт после основной видимости, если есть.
//

const form = new FormManager('#amtk_metar_editor')

metar_type_component(form)
metar_icao_component(form)
metar_datetime_component(form)
metar_wind_component(form)
metar_cavok_component(form)
metar_visibility_component(form)
metar_weather_component(form)
metar_clouds_component(form)
metar_temperature_component(form)
metar_pressure_component(form)
metar_trend_component(form)



// Pressure

function auxiliaryPressure(value, element) {

  const { pressure, pressure_range } = this.elements

  switch (element) {

    case pressure:
      pressure_range.value = pressure.value
      break

    case pressure_range:
      pressure.value = pressure_range.value
      break
  }

}

function updatePressure(value, element) {
  const result = value < 900 || value > 1100 ? '' : value
  return result === '' ? '' : `Q${result}`
}

form.addHandler('pressure', {

  format(value) {
    value = value.trim()
                 .replace(/\D/, '')
                 .substring(0, 4)

    if (value === '')
      return ''

    return +value > 1100 ? 1100 : value
  },

  auxiliary(value) {
    const { pressure_range } = this.elements
    pressure_range.value = value === '' || +value < 500 ? 499 : value
  },

  update: updatePressure,

})

form.addHandler('pressure', {

  element: 'pressure_range',

  auxiliary(value) {
    const { pressure } = this.elements
    pressure.value = +value === 499 ? '' : value
  },

  update: updatePressure,

})


// TREND

form.addHandler('trend', {
  element: 'trend_text',
  format: (value) => value.trim().toUpperCase(),
  update: (value) => value,
})
