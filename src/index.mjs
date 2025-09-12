
// file: src/index.mjs

import AMTK_ICAOS      from './core/icaos.mjs'
import AMTK_VISIBILITY from './core/visibility.mjs'
import FormManager     from './core/form_manager.mjs'

import metar_type_component from './components/metar_type.mjs'


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



// ICAO

function updateAssumptions() {
  const { icao, icao_variants } = this.elements
  const { value } = icao
  icao_variants.innerHTML = ''
  for (const variant of AMTK_ICAOS) {
    if (variant.startsWith(value)) {
      const option = document.createElement('option')
      option.value = variant
      option.textContent = variant
      icao_variants.append(option)
    }
  }
}

function updateICAO() {
  const { icao } = this.elements
  const { value } = icao
  return value.length === 4 ? value : ''
}

// @todo позиция курсора
form.addHandler('icao', {

  format(value) {
    return value.trim()
                .toUpperCase()
                .replace(/[^A-Z]/, '')
                .substring(0, 4)
  },

  auxiliary: updateAssumptions,
  update: updateICAO,

})

form.addHandler('icao', {

  element: 'icao_variants',

  init: updateAssumptions,

  auxiliary(value, element) {
    const { icao } = this.elements
    icao.value = value
  },

  update: updateICAO,

})


// DateTime

function datetime_update(value) {
  const { date, time } = this.elements
  const date_value = date.value?.split('-')?.at(-1)
  const time_value = time.value?.split(':')?.join('')
  return date_value && time_value
    ? `${date_value}${time_value}Z`
    : ''
}

function setCurrentDatetime() {
  const { date, time } = this.elements
  const now = new Date()
  const y = now.getUTCFullYear()
  const m = (now.getUTCMonth() + 1).toString().padStart(2, '0')
  const d = now.getUTCDate().toString().padStart(2, '0')
  const h = now.getUTCHours().toString().padStart(2, '0')
  const i = now.getUTCMinutes().toString().padStart(2, '0')
  date.value = `${y}-${m}-${d}`
  time.value = `${h}:${i}`
}

form.addHandler('datetime', {
  element: 'date',
  update: datetime_update,
})

form.addHandler('datetime', {
  element: 'time',
  update: datetime_update,
})

form.addHandler('datetime', {
  element: 'current',
  auxiliary: setCurrentDatetime,
  update: datetime_update,
})


// Wind
// @todo VRB

function updateWind() {
  const { units } = this.elements
  const { direction, speed, gust } = this.elements
  const { direction_range, speed_range, gust_range } = this.elements
  const { vrb } = this.elements

  let result = ''

  if (direction.value === '' || speed.value === '') {
    return result
  }

  result += `${direction.value.padStart(3, '0')}${speed.value.padStart(2, '0')}`

  if (+gust.value > +speed.value) {
    result += `G${+gust.value}`
  }

  for (const unit of units) {
    if (unit.checked) {
      result += `${unit.value}`; break
    }
  }

  return result
}

function auxiliaryWind(value, element) {

  const { direction, speed, gust } = this.elements
  const { direction_range, speed_range, gust_range } = this.elements

  switch (element) {

    case direction: {
      direction_range.value = value === '' ? -10 : Math.round(value * .1) * 10
      break
    }

    case speed: {
      speed_range.value = value === '' ? -1 : value
      break
    }

    case gust: {
      gust_range.value = value === '' ? -1 : value
      break
    }

  }

}

function auxiliaryWindRange(value, element) {

  const { direction, speed, gust } = this.elements
  const { direction_range, speed_range, gust_range } = this.elements

  switch (element) {
    case direction_range:
      direction.value = value === '-10' ? '' : parseInt(value); break

    case speed_range:
      speed.value = value === '-1' ? '' : parseInt(value); break

    case gust_range:
      gust.value = value === '-1' ? '' : parseInt(value); break
  }

}

form.addHandler('wind', {

  element: 'calm',

  auxiliary(value, element) {

    const { units } = this.elements
    const { direction, speed, gust } = this.elements
    const { direction_range, speed_range, gust_range } = this.elements
    //const { vrb } = this.elements

    units.forEach((unit) => unit.disabled = element.checked)
    direction.disabled = element.checked
    speed.disabled = element.checked
    gust.disabled = element.checked
    direction_range.disabled = element.checked
    speed_range.disabled = element.checked
    gust_range.disabled = element.checked
    //vrb.disabled = element.checked

    if (element.checked) {
      units.forEach((unit) => unit.checked = unit.value === 'MPS')
      direction.value = ''
      speed.value = ''
      gust.value = ''
      direction_range.value = -10
      speed_range.value = -1
      gust_range.value = -1
      //vrb.checked = false
    }

  },

  update(value, element) {
    return element.checked ? 'CALM' : ''
  },

})

form.addHandler('wind', {

  element: 'units',

  init(elements) {
    for (const element of elements) {
      element.checked = element.value === 'MPS'
    }
  },

  update: updateWind,
})

form.addHandler('wind', {

  element: 'direction',

  format(value) {

    const result = parseInt(value
                              .trim()
                              .replace(/\D/, '')
                              .substring(0, 3))

    if (isNaN(result)) return ''
    if (result > 360)  return 360
    return result
  },

  auxiliary(value) {
    const { direction_range } = this.elements
    direction_range.value = value === '' ? -20 : value
  },

  update: updateWind,

})

form.addHandler('wind', {

  element: 'speed',

  format(value) {
    return parseInt(value
                      .trim()
                      .replace(/\D/, '')
                      .substring(0, 2))
  },

  auxiliary(value) {
    const { speed_range } = this.elements
    speed_range.value = value
  },

  update: updateWind,

})

form.addHandler('wind', {

  element: 'gust',

  format(value) {
    return parseInt(value
                      .trim()
                      .replace(/\D/, '')
                      .substring(0, 2))
  },

  auxiliary(value) {
    const { gust_range } = this.elements
    gust_range.value = value
  },

  update: updateWind,
})

form.addHandler('wind', {
  element:  'direction_range',
  auxiliary: auxiliaryWindRange,
  update:    updateWind,
})

form.addHandler('wind', {
  element:  'speed_range',
  auxiliary: auxiliaryWindRange,
  update:    updateWind,
})

form.addHandler('wind', {
  element:  'gust_range',
  auxiliary: auxiliaryWindRange,
  update:    updateWind,
})


// Cavok

form.addHandler('cavok', {

  element: 'cavok',

  auxiliary(value, element) {

    const { result } = this
    const { visibility, visibility_range } = this.elements
    const { weather, intensity, precipitation, phenomena } = this.elements
    const { clouds_1_coverage, clouds_1, clouds_1_type, clouds_1_height } = this.elements
    const { clouds_2_coverage, clouds_2, clouds_2_type, clouds_2_height } = this.elements
    const { clouds_3_coverage, clouds_3, clouds_3_type, clouds_3_height } = this.elements
    const { clouds_4_coverage, clouds_4, clouds_4_type, clouds_4_height } = this.elements

    if (element.checked) {
      visibility.value = ''
      visibility_range.value = -1
      weather.value = ''
      intensity.forEach(item => item.checked = false)
      precipitation.value = ''
      phenomena.value = ''
      clouds_1_coverage.value = 'NCD'
      clouds_1.value = ''
      clouds_1_type.forEach(type => type.checked = false)
      clouds_1_height.value = -1
      clouds_2_coverage.value = 'NCD'
      clouds_2.value = ''
      clouds_2_type.forEach(type => type.checked = false)
      clouds_2_height.value = -1
      clouds_3_coverage.value = 'NCD'
      clouds_3.value = ''
      clouds_3_type.forEach(type => type.checked = false)
      clouds_3_height.value = -1
      clouds_4_coverage.value = 'NCD'
      clouds_4.value = ''
      clouds_4_type.forEach(type => type.checked = false)
      clouds_4_height.value = -1
      visibility.disabled = true
      visibility_range.disabled = true
      weather.disabled = true
      intensity.forEach(item => item.disabled = true)
      precipitation.disabled = true
      phenomena.disabled = true
      clouds_1_coverage.disabled = true
      clouds_1.disabled = true
      clouds_1_type.forEach(type => type.disabled = true)
      clouds_1_height.disabled = true
      clouds_2_coverage.disabled = true
      clouds_2.disabled = true
      clouds_2_type.forEach(type => type.disabled = true)
      clouds_2_height.disabled = true
      clouds_3_coverage.disabled = true
      clouds_3.disabled = true
      clouds_3_type.forEach(type => type.disabled = true)
      clouds_3_height.disabled = true
      clouds_4_coverage.disabled = true
      clouds_4.disabled = true
      clouds_4_type.forEach(type => type.disabled = true)
      clouds_4_height.disabled = true
      result.set('visibility', '')
      result.set('weather', '')
      result.set('clouds_1', '')
      result.set('clouds_2', '')
      result.set('clouds_3', '')
      result.set('clouds_4', '')
    } else {
      visibility.disabled = false
      visibility_range.disabled = false
      weather.disabled = false
      intensity.forEach(item => item.disabled = false)
      precipitation.disabled = false
      phenomena.disabled = false
      clouds_1_coverage.disabled = false
      clouds_1.disabled = false
      clouds_1_type.forEach(type => type.disabled = false)
      clouds_1_height.disabled = false
      clouds_2_coverage.disabled = false
      clouds_2.disabled = false
      clouds_2_type.forEach(type => type.disabled = false)
      clouds_2_height.disabled = false
      clouds_3_coverage.disabled = false
      clouds_3.disabled = false
      clouds_3_type.forEach(type => type.disabled = false)
      clouds_3_height.disabled = false
      clouds_4_coverage.disabled = false
      clouds_4.disabled = false
      clouds_4_type.forEach(type => type.disabled = false)
      clouds_4_height.disabled = false
    }
  },

  update(value, element) {
    return element.checked ? element.value : ''
  },

})


// Visibility

function updateVisibility() {
  const { visibility } = this.elements
  const { value } = visibility
  return value === '' ? '' : value.padStart(4, '0')
}

form.addHandler('visibility', {

  format: (value) => value
                       .trim()
                       .replace(/\D/, '')
                       .substring(0, 4),

  auxiliary(value) {
    const { visibility_range } = this.elements

    if (value === '') visibility_range.value = -1

    const visibilityValue = +value

    const base = visibilityValue < 800  ? 50
               : visibilityValue < 5000 ? 100
               : visibilityValue < 9999 ? 1000
               : 0

    let visibilityRangeValue = AMTK_VISIBILITY.at(-1)

    if (base > 0) {
      const roundedValue = Math.floor(visibilityValue / base) * base
      visibilityRangeValue = AMTK_VISIBILITY.indexOf(roundedValue)
    }

    visibility_range.value = visibilityRangeValue.toString()
  },

  update: updateVisibility,

})

form.addHandler('visibility', {

  element: 'visibility_range',

  init(elements) {
    const element = elements[0]
    element.setAttribute('min', 0)
    element.setAttribute('max', AMTK_VISIBILITY.length - 1)
    element.value = AMTK_VISIBILITY[0]
  },

  auxiliary(value) {
    value = +value
    const { visibility } = this.elements
    visibility.value = value === 0 ? '' : AMTK_VISIBILITY[value]
  },

  update: updateVisibility,

})


// Weather

function auxiliaryPhenomena(value) {
  const { weather } = this.elements
  if (value !== '') weather.value += value
}

function updateWeather() {
  const { weather } = this.elements
  const value = weather.value.trim()
  return value.length > 1 ? value : ''
}

form.addHandler('weather', {

  element: 'weather',

  format(value) {
    return value
             .toUpperCase()
             .replace(/[^-+A-Z ]/, '')
  },

  auxiliary(value) {
    const { intensity } = this.elements
    const sign = value[0]
    for (const item of intensity) {
      item.checked = item.value === sign 
    }
  },

  update: updateWeather,

})

form.addHandler('weather', {

  element: 'intensity',

  auxiliary(value, element) {

    let sign = ''
    const { intensity, weather } = this.elements

    for (const item of intensity) {
      if (item !== element) item.checked = false
      if (item.checked) sign = item.value
    }

    weather.value = weather.value.replace(/^[+-]/, '')
    if (sign) {
      weather.value = sign + weather.value
    }
  },

  update: updateWeather,

})

form.addHandler('weather', {
  element: 'precipitation',
  auxiliary: auxiliaryPhenomena,
  update: updateWeather,
})

form.addHandler('weather', {
  element: 'phenomena',
  auxiliary: auxiliaryPhenomena,
  update: updateWeather,
})


// Clouds

function formatClouds(value) {
  value = value.trim()
  if (value === '') return ''
  const result = value
                   .substr(0, 3)
                   .replace(/\D/, '')
  return +result > 120 ? 120 : result 
}

function updateClouds(_, element) {

  let height, coverage, types

  const { clouds_1, clouds_1_coverage, clouds_1_height, clouds_1_type } = this.elements
  const { clouds_2, clouds_2_coverage, clouds_2_height, clouds_2_type } = this.elements
  const { clouds_3, clouds_3_coverage, clouds_3_height, clouds_3_type } = this.elements
  const { clouds_4, clouds_4_coverage, clouds_4_height, clouds_4_type } = this.elements

  if (
    clouds_1 === element
    || clouds_1_coverage === element
    || clouds_1_height === element
    || Array.from(clouds_1_type).includes(element)
  ) {
    height = clouds_1.value.trim()
    coverage = clouds_1_coverage.value
    types = clouds_1_type
  }

  else if (
    clouds_2 === element
    || clouds_2_coverage === element
    || clouds_2_height === element
    || Array.from(clouds_2_type).includes(element)
  ) {
    height = clouds_2.value.trim()
    coverage = clouds_2_coverage.value
    types = clouds_2_type
  }


  else if (
    clouds_3 === element
    || clouds_3_coverage === element
    || clouds_3_height === element
    || Array.from(clouds_3_type).includes(element)
  ) {
    height = clouds_3.value.trim()
    coverage = clouds_3_coverage.value
    types = clouds_3_type
  }

  else if (
    clouds_4 === element
    || clouds_4_coverage === element
    || clouds_4_height === element
    || Array.from(clouds_4_type).includes(element)
  ) {
    height = clouds_4.value.trim()
    coverage = clouds_4_coverage.value
    types = clouds_4_type
  }

  else
    throw new TypeError(`Unable to find the required cloud layer`)

  if (height === '') return ''

  let result = ''
  result += coverage
  result += height.padStart(3, '0')

  for (const type of types) {
    if (type.checked) {
      result += type.value
    }
  }

  return result
}

function auxiliaryClouds1(value) {
  const { clouds_1_height: height } = this.elements
  height.value = value === '' ? -1 : +value 
}

function auxiliaryClouds1Height(value) {
  const { clouds_1 } = this.elements
  clouds_1.value = +value === -1 ? '' : value
}

function auxiliaryClouds1Coverage(value) {
  const {
    clouds_1: height,
    clouds_1_height: range,
    clouds_1_type: types,
  } = this.elements
  if (value === 'NCD') {
    height.value = ''
    range.value = -1
    types.forEach((type) => type.checked = false)
  }
}

function auxiliaryClouds1Type(value, element) {
  const { clouds_1_type: types } = this.elements
  for (const type of types) {
     if (type !== element) {
       type.checked = false
     }
   }
}

form.addHandler('clouds_1', {
  element: 'clouds_1',
  format: formatClouds,
  auxiliary: auxiliaryClouds1,
  update: updateClouds,
})

form.addHandler('clouds_1', {
  element: 'clouds_1_height',
  auxiliary: auxiliaryClouds1Height,
  update: updateClouds,
})

form.addHandler('clouds_1', {
  element: 'clouds_1_coverage',
  auxiliary: auxiliaryClouds1Coverage,
  update: updateClouds,
})

form.addHandler('clouds_1', {
  element: 'clouds_1_type',
  auxiliary: auxiliaryClouds1Type,
  update: updateClouds,
})

function updateClouds2() {
  let {
    clouds_2: height,
    clouds_2_coverage: coverage,
    clouds_2_type: types,
  } = this.elements
  height = height.value.trim()
  coverage = coverage.value
  if (height === '' || coverage === 'NCD') return ''
  let result = ''
  result += coverage
  result += height.padStart(3, '0')
  for (const type of types) {
    if (type.checked) {
      result += type.value
    }
  }
  return result
}

function auxiliaryClouds2(value) {
  const { clouds_2_height: height } = this.elements
  height.value = value === '' ? -1 : +value 
}

function auxiliaryClouds2Height(value) {
  const { clouds_2 } = this.elements
  clouds_2.value = +value === -1 ? '' : value
}

function auxiliaryClouds2Coverage(value) {
  const {
    clouds_2: height,
    clouds_2_height: range,
    clouds_2_type: types,
  } = this.elements
  if (value === 'NCD') {
    height.value = ''
    range.value = -1
    types.forEach((type) => type.checked = false)
  }
}

function auxiliaryClouds2Type(value, element) {
  const { clouds_2_type: types } = this.elements
  for (const type of types) {
     if (type !== element) {
       type.checked = false
     }
   }
}

form.addHandler('clouds_2', {
  element: 'clouds_2',
  format: formatClouds,
  auxiliary: auxiliaryClouds2,
  update: updateClouds,
})

form.addHandler('clouds_2', {
  element: 'clouds_2_height',
  auxiliary: auxiliaryClouds2Height,
  update: updateClouds,
})

form.addHandler('clouds_2', {
  element: 'clouds_2_coverage',
  auxiliary: auxiliaryClouds2Coverage,
  update: updateClouds,
})

form.addHandler('clouds_2', {
  element: 'clouds_2_type',
  auxiliary: auxiliaryClouds2Type,
  update: updateClouds,
})

function updateClouds3() {
  let {
    clouds_3: height,
    clouds_3_coverage: coverage,
    clouds_3_type: types,
  } = this.elements
  height = height.value.trim()
  coverage = coverage.value
  if (height === '' || coverage === 'NCD') return ''
  let result = ''
  result += coverage
  result += height.padStart(3, '0')
  for (const type of types) {
    if (type.checked) {
      result += type.value
    }
  }
  return result
}

function auxiliaryClouds3(value) {
  const { clouds_3_height: height } = this.elements
  height.value = value === '' ? -1 : +value 
}

function auxiliaryClouds3Height(value) {
  const { clouds_3 } = this.elements
  clouds_3.value = +value === -1 ? '' : value
}

function auxiliaryClouds3Coverage(value) {
  const {
    clouds_3: height,
    clouds_3_height: range,
    clouds_3_type: types,
  } = this.elements
  if (value === 'NCD') {
    height.value = ''
    range.value = -1
    types.forEach((type) => type.checked = false)
  }
}

function auxiliaryClouds3Type(value, element) {
  const { clouds_3_type: types } = this.elements
  for (const type of types) {
     if (type !== element) {
       type.checked = false
     }
   }
}

form.addHandler('clouds_3', {
  element: 'clouds_3',
  format: formatClouds,
  auxiliary: auxiliaryClouds3,
  update: updateClouds,
})

form.addHandler('clouds_3', {
  element: 'clouds_3_height',
  auxiliary: auxiliaryClouds3Height,
  update: updateClouds,
})

form.addHandler('clouds_3', {
  element: 'clouds_3_coverage',
  auxiliary: auxiliaryClouds3Coverage,
  update: updateClouds,
})

form.addHandler('clouds_3', {
  element: 'clouds_3_type',
  auxiliary: auxiliaryClouds3Type,
  update: updateClouds,
})

function auxiliaryClouds4(value) {
  const { clouds_4_height: height } = this.elements
  height.value = value === '' ? -1 : +value 
}

function auxiliaryClouds4Height(value) {
  const { clouds_4 } = this.elements
  clouds_4.value = +value === -1 ? '' : value
}

function auxiliaryClouds4Coverage(value) {
  const {
    clouds_4: height,
    clouds_4_height: range,
    clouds_4_type: types,
  } = this.elements
  if (value === 'NCD') {
    height.value = ''
    range.value = -1
    types.forEach((type) => type.checked = false)
  }
}

function auxiliaryClouds4Type(value, element) {
  const { clouds_4_type: types } = this.elements
  for (const type of types) {
     if (type !== element) {
       type.checked = false
     }
   }
}

form.addHandler('clouds_4', {
  element: 'clouds_4',
  format: formatClouds,
  auxiliary: auxiliaryClouds4,
  update: updateClouds,
})

form.addHandler('clouds_4', {
  element: 'clouds_4_height',
  auxiliary: auxiliaryClouds4Height,
  update: updateClouds,
})

form.addHandler('clouds_4', {
  element: 'clouds_4_coverage',
  auxiliary: auxiliaryClouds4Coverage,
  update: updateClouds,
})

form.addHandler('clouds_4', {
  element: 'clouds_4_type',
  auxiliary: auxiliaryClouds4Type,
  update: updateClouds,
})


// Temperature

function formatTemperature(value) { // @todo fix bug -0

  value = value.trim()

  if (value === '-')
    return value

  if (value === '' || isNaN(value))
    return ''

  const number = +value.match(/-?\d?\d?/)

  if (isNaN(number) && value.startsWith('-'))
    return '-'

  return isNaN(number) ? '' 
       : number < -80  ? -80
       : number >  80  ?  80
       : number
}

function updateTemperature() {

  const { temperature, dew_point } = this.elements

  if (
    ['', '-'].includes(temperature.value)
    && ['', '-'].includes(dew_point.value)
  ) {
    return ''
  }

  const temperature_value =
    isNaN(+temperature.value) ? '' : temperature.value

  const dew_point_value =
    isNaN(+dew_point.value) ? '' : dew_point.value

  let result = ''

  result +=
    temperature_value === '' ? '/' : temperature_value.replace('-', 'M')

  result += '/'

  result +=
    dew_point_value === '' ? '/' : dew_point_value.replace('-', 'M')

  return result

}

function auxiliaryTemperature(value, element) {

  const { temperature, dew_point } = this.elements
  const { temperature_range, dew_point_range } = this.elements
  const { temperature_minus, dew_point_minus } = this.elements

  let linkedElement = null
  let minusElement = null

  switch (element) {

    case temperature:
      linkedElement = temperature_range
      minusElement = temperature_minus
      break

    case dew_point:
      linkedElement = dew_point_range
      minusElement = dew_point_minus
      break

    default: throw new TypeError(`unknown element`)
  }

  if (
    !(linkedElement instanceof HTMLInputElement)
  ) {
    throw new TypeError('not an input element')
  }

  if (
    !(minusElement instanceof HTMLInputElement)
  ) {
    throw new TypeError(`minusElement is not a proper HTMLInputElement`)
  }

  linkedElement.value = value === '' || value === '-'
      ? -1
      : Math.abs(value)

  minusElement.checked = value.startsWith('-')
}

function auxiliaryTemperatureRange(value, element) {

  const { temperature, dew_point } = this.elements
  const { temperature_range, dew_point_range } = this.elements
  const { temperature_minus, dew_point_minus } = this.elements

  let linkedElement = ''
  let minusElement = ''

  switch (element) {

    case temperature_range:
      linkedElement = temperature
      minusElement = temperature_minus
      break

    case dew_point_range:
      linkedElement = dew_point
      minusElement = dew_point_minus
      break

    default: throw new Error(`unknown element`)
  }

  if (
    !(linkedElement instanceof HTMLInputElement)
    || !('value' in linkedElement)
  ) {
    throw new TypeError(`linkedElement must be a typeof HTMLInputElement(text), but got ${typeof linkedElement}`)
  }

  if (
    !(minusElement instanceof HTMLInputElement)
    || minusElement?.type !== 'checkbox'
  ) {
    throw new TypeError(`minusElement must be a typeof HTMLInputElement(checkbox), but got ${typeof minusElement}`)
  }

  //if (value < 0) {
  //  linkedElement.value = ''
  //} else {
  //  if (minusElement.checked)
  //    value = `-${value}`
  //  linkedElement.value = value
  //}

  linkedElement.value = value < 0            ? ''          :
                        minusElement.checked ? `-${value}` :
                        /* default */          value
}

form.addHandler('temperature', {
  element: 'temperature',
  format: formatTemperature,
  auxiliary: auxiliaryTemperature,
  update: updateTemperature,
})

form.addHandler('temperature', {
  element: 'dew_point',
  format: formatTemperature,
  auxiliary: auxiliaryTemperature,
  update: updateTemperature,
})

form.addHandler('temperature', {
  element: 'temperature_range',
  //auxiliary(value) { // @todo auxiliaryTemperatureRange
  //  const { temperature } = this.elements
  //  temperature.value = value < 0 ? '' : value
  //},
  auxiliary: auxiliaryTemperatureRange,
  update: updateTemperature,
})

form.addHandler('temperature', {
  element: 'dew_point_range',
  //auxiliary(value) { // @todo auxiliaryTemperatureRange
  //  const { dew_point } = this.elements
  //  dew_point.value = value < 0 ? '' : value
  //},
  auxiliary: auxiliaryTemperatureRange,
  update: updateTemperature,
})

function auxiliaryTemperatureMinus(_, element) {

  const { temperature, dew_point } = this.elements
  let linkedElement = ''
  let value = ''

  if (element.checked) value += '-'

  switch (element.name) {
    case 'temperature_minus': linkedElement = temperature; break
    case 'dew_point_minus': linkedElement = dew_point; break
    default: throw TypeError(`unknown element name`)
  }

  value += linkedElement.value.replace(/\D/, '')
  if (!isNaN(value)) linkedElement.value = value

}

form.addHandler('temperature', {
    element: 'temperature_minus',
    auxiliary: auxiliaryTemperatureMinus,
    update: updateTemperature,
})

form.addHandler('temperature', {
    element: 'dew_point_minus',
    auxiliary: auxiliaryTemperatureMinus,
    update: updateTemperature,
})


// Pressure

function auxiliaryPressure(value, element) {
  const { pressure, pressure_range } = this.elements
  switch (element) {
    case pressure: pressure_range.value = pressure.value; break
    case pressure_range: pressure.value = pressure_range.value; break
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
