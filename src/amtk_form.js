;(async () => {

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


// Список ICAO для поисковых подсказок
const AMTK_ICAOS = [
  'HKHB',
  'HRYR',
  'TAPT',
  'UEEA',
  'UEEE',
  'UELL',
  'UERP',
  'UERR',
  'UESO',
  'UESS',
  'UEST',
  'UHBB',
  'UHBI',
  'UHBW',
  'UHHH',
  'UHKK',
  'UHMA',
  'UHMD',
  'UHMM',
  'UHMP',
  'UHNN',
  'UHOO',
  'UHPP',
  'UHSS',
  'UHWW',
  'UIAA',
  'UIBB',
  'UIBS',
  'UIII',
  'UITT',
  'UIUU',
  'ULAA',
  'ULAM',
  'ULAS',
  'ULBC',
  'ULDD',
  'ULKK',
  'ULLI',
  'ULMK',
  'ULMM',
  'ULNN',
  'ULOL',
  'ULOO',
  'ULPB',
  'ULSS',
  'ULWU',
  'ULWW',
  'UMKK',
  'UNAA',
  'UNBB',
  'UNEE',
  'UNII',
  'UNKL',
  'UNKS',
  'UNKY',
  'UNNT',
  'UNOO',
  'UNSS',
  'UNTT',
  'UNWW',
  'UODD',
  'UOHH',
  'UOII',
  'URKA',
  'URKG',
  'URKK',
  'URMG',
  'URML',
  'URMM',
  'URMN',
  'URMO',
  'URMT',
  'URRR',
  'URRY',
  'URSS',
  'URWA',
  'URWI',
  'URWW',
  'USCC',
  'USCM',
  'USDD',
  'USHU',
  'USII',
  'USKK',
  'USMM',
  'USMU',
  'USNN',
  'USNR',
  'USPP',
  'USRK',
  'USRN',
  'USRO',
  'USRR',
  'USSS',
  'USTJ',
  'USTO',
  'USTR',
  'USUU',
  'UUBA',
  'UUBB',
  'UUBC',
  'UUBI',
  'UUBK',
  'UUBP',
  'UUBS',
  'UUBT',
  'UUDD',
  'UUDL',
  'UUEE',
  'UUEM',
  'UUOB',
  'UUOK',
  'UUOL',
  'UUOO',
  'UUOR',
  'UUOT',
  'UUWR',
  'UUWW',
  'UUYH',
  'UUYI',
  'UUYP',
  'UUYS',
  'UUYW',
  'UUYY',
  'UWGG',
  'UWKB',
  'UWKD',
  'UWKE',
  'UWKJ',
  'UWKS',
  'UWLW',
  'UWOO',
  'UWOR',
  'UWPP',
  'UWPS',
  'UWSB',
  'UWSS',
  'UWUB',
  'UWUF',
  'UWUK',
  'UWUU',
  'UWWW',
]


// Допустимые значения видимости
const AMTK_VISIBILITY = [-1]
for (let i = 0;    i < 800;   i += 50)   AMTK_VISIBILITY.push(i)
for (let i = 800;  i < 5000;  i += 100)  AMTK_VISIBILITY.push(i)
for (let i = 5000; i < 10000; i += 1000) AMTK_VISIBILITY.push(i)
                                         AMTK_VISIBILITY.push(9999)


class AMTK_Form {

  #non_clickable_types = [
    'text',
    'date',
    'time',
    'radio',
    'checkbox',
  ]

  #handled_events = [
    'click',
    'input',
  ]

  root     = null
  output   = null
  elements = null

  forms = {
    input:  null,
    output: null,
  }

  result   = new Map()
  registry = new Map()

  constructor(selector) {

    this.root = document.querySelector(selector)

    if (!this.root) {
      console.warn(`can't find a form 'root' with selector ${selector}`)
    }

    const forms = Array.from(this.root.children)
                       .filter(child => child.tagName === 'FORM')

    this.forms.input  = forms?.find(form => form.name.match(/input/i))
    this.forms.output = forms?.find(form => form.name.match(/output/i))

    if (!this.forms.input) {
      console.warn(`can't find 'input' form in 'root' element ${selector}`)
    }

    if (!this.forms.output) {
      console.warn(`can't find 'output' form in 'root' element ${selector}`)
    }

    this.elements = this.forms.input.elements
    this.output   = this.forms.output.elements.output

    this.#handled_events.forEach(handled_event =>
      this.forms.input.addEventListener(
        handled_event, (event) => this.#dispatch(event)))

  }

  #dispatch(event) {

    const element = Array.from(this.elements)
                         .find(element => element === event.target)

    if (!element) return

    if (event.type === 'click') {
      if (
        (element instanceof HTMLInputElement
         && this.#non_clickable_types.includes(element.type))
        || element instanceof HTMLSelectElement
      ) {
        return
      }
    }

    const record = this.registry.get(element)
    if (!record) return

    const { name }  = record
    const { format, auxiliary, update } = record.callbacks

    if (format) {
      element.value = format.call(this, element.value, element)
    }

    if (auxiliary) {
      auxiliary.call(this, element.value, element)
    }

    if (update) {
      const value = update.call(this, element.value, element)
      this.result.set(name, value)
    }

    this.#update()
  }

  #update() {
    const result = []

    for (const [key, value] of this.result) {
      const item = value.trim()
      if (item !== '') result.push(item)
    }

    const text = result.join(' ')

    this.output instanceof HTMLInputElement
      ? this.output.value = text
      : this.output.textContent = text
  }

  #checkHandlerArguments(groupname, options) {
    if (typeof groupname !== 'string' || groupname === '') {
      throw new TypeError(`AMTK_Form::addHandler must be a non empty string`)
    }
  }

  #createResultToken(name) {
    if (!this.result.has(name)) {
      this.result.set(name, '')
    }
  }

  #getElementsByName(name) {
    return Array.from(this.elements)
                .filter((element) => element.name === name)
  }

  #createRecord(groupname, { format, auxiliary, update }) {
    return {
      name: groupname,
      callbacks: { format, auxiliary, update },
    }
  }

  #writeRecordToRegistry(elements, record) {
    elements.forEach((element) => this.registry.set(element, record))
  }

  #updateResultByValueOf(element) {
    const record = this.registry.get(element)
    this.result.set(record.name, element.value)
  }

  #handleCheckedElements(elements, { checked }) {

    if (!checked) {
      return
    }

    if (typeof checked === 'string') {
      checked = [checked]
    }

    if (!Array.isArray(checked)) {
      throw new TypeError(
        `'checked' must be 'string', 'array of strings' or 'null'`
      )
    }

    for (const value of checked) {

      if (typeof value !== 'string') {
        throw new TypeError(
          `'checked' must be 'string', 'array of strings' or 'null'`
        )
      }

      for (const element of elements) {
        if (
          element instanceof HTMLInputElement
          && ['checkbox', 'radio'].includes(element.type)
        ) {
          if (element.value === value) {
            element.checked = true
            this.#updateResultByValueOf(element)
          }
        }
      }

    }

    this.#update()
  }

  #runInitHandler(elements, { init }) {
    if (init) {
      init.call(this, elements)
      this.#update()
    }
  }

  addHandler(name, options = {}) {

    // token  - specific HTMLInput 'name' attribute
    //          or abstract group of HTMLInput elemments
    // record = { token, callbacks }
    // -------------------------------------------------
    // this.registry = Map(element, record)
    // this.result   = Map(token, value)

    this.#checkHandlerArguments(name, options)

    this.#createResultToken(name)

    const elements = this.#getElementsByName(options.element ?? name)
    const record = this.#createRecord(name, options)

    this.#writeRecordToRegistry(elements, record)

    this.#handleCheckedElements(elements, options)
    this.#runInitHandler(elements, options)
  }

}


const form = new AMTK_Form('#amtk_metar_editor')


// Type

function updateType() {
  let result = ''
  for (const type of this.elements.type) {
    if (type.checked) {
      result += type.value
      break
    }
  }
  const { cor } = this.elements
  result += cor.checked ? ` ${cor.value}` : ''
  return result
}

form.addHandler('type', {
  checked: 'METAR',
  update: updateType,
})

form.addHandler('type', {
  element: 'cor',
  update: updateType,
})


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

function updateClouds1() {
  let {
    clouds_1: height,
    clouds_1_coverage: coverage,
    clouds_1_type: types,
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
  update: updateClouds1,
})

form.addHandler('clouds_1', {
  element: 'clouds_1_height',
  auxiliary: auxiliaryClouds1Height,
  update: updateClouds1,
})

form.addHandler('clouds_1', {
  element: 'clouds_1_coverage',
  auxiliary: auxiliaryClouds1Coverage,
  update: updateClouds1,
})

form.addHandler('clouds_1', {
  element: 'clouds_1_type',
  auxiliary: auxiliaryClouds1Type,
  update: updateClouds1,
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
  update: updateClouds2,
})

form.addHandler('clouds_2', {
  element: 'clouds_2_height',
  auxiliary: auxiliaryClouds2Height,
  update: updateClouds2,
})

form.addHandler('clouds_2', {
  element: 'clouds_2_coverage',
  auxiliary: auxiliaryClouds2Coverage,
  update: updateClouds2,
})

form.addHandler('clouds_2', {
  element: 'clouds_2_type',
  auxiliary: auxiliaryClouds2Type,
  update: updateClouds2,
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
  update: updateClouds3,
})

form.addHandler('clouds_3', {
  element: 'clouds_3_height',
  auxiliary: auxiliaryClouds3Height,
  update: updateClouds3,
})

form.addHandler('clouds_3', {
  element: 'clouds_3_coverage',
  auxiliary: auxiliaryClouds3Coverage,
  update: updateClouds3,
})

form.addHandler('clouds_3', {
  element: 'clouds_3_type',
  auxiliary: auxiliaryClouds3Type,
  update: updateClouds3,
})

function updateClouds4() {
  let {
    clouds_4: height,
    clouds_4_coverage: coverage,
    clouds_4_type: types,
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
  update: updateClouds4,
})

form.addHandler('clouds_4', {
  element: 'clouds_4_height',
  auxiliary: auxiliaryClouds4Height,
  update: updateClouds4,
})

form.addHandler('clouds_4', {
  element: 'clouds_4_coverage',
  auxiliary: auxiliaryClouds4Coverage,
  update: updateClouds4,
})

form.addHandler('clouds_4', {
  element: 'clouds_4_type',
  auxiliary: auxiliaryClouds4Type,
  update: updateClouds4,
})


// Temperature

function formatTemperature(value) {

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
       : number >  60  ?  60
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

form.addHandler('temperature', {

  element: 'temperature',

  format: formatTemperature,

  auxiliary(value) {
    const { temperature_range } = this.elements
    temperature_range.value = ['', '-'].includes(value) ? -81 : value
  },

  update: updateTemperature,

})

form.addHandler('temperature', {

  element: 'dew_point',

  format: formatTemperature,

  auxiliary(value) {
    const { dew_point_range } = this.elements
    dew_point_range.value = ['', '-'].includes(value) ? -81 : value
  },

  update: updateTemperature,

})

form.addHandler('temperature', {

  element: 'temperature_range',

  auxiliary(value) {
    value = +value
    const { temperature } = this.elements
    temperature.value = value === -81 ? '' : value
  },

  update: updateTemperature,

})

form.addHandler('temperature', {

  element: 'dew_point_range',

  auxiliary(value) {
    value = +value
    const { dew_point } = this.elements
    dew_point.value = value === -81 ? '' : value
  },

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
  const result = value < 500 || value > 1100 ? '' : value
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

})();
