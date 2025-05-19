// ############################################################# //
//  Some usefull data                                            //
// ############################################################# //

// ~/.local/share/geary/account_01/attachments/641/349/an03_20ed_ru.pdf
// Таблица А3-2. Образец сводок (140)
// Таблица А3-5. Диапазоны и дискретность (145)


// ############################################################# //
//  Content                                                      //
// ############################################################# //

// * Globals
// * Core code
// * User code
// ** init
// ** utils
// ** event handlers
// *** Тип сводки
// *** ICAO
// *** Дата и время
// *** Ветер
// *** Видимость
// *** Осадки и явления погоды
// *** Облачность
// *** Температура
// *** Давление


// ############################################################# //
//  Globals                                                      //
// ############################################################# //

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
    'USTO',
    'USTJ',
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
const AMTK_VISIBILITY = []
for (let i = 0;    i < 800;   i += 50)   AMTK_VISIBILITY.push(i)
for (let i = 800;  i < 5000;  i += 100)  AMTK_VISIBILITY.push(i)
for (let i = 5000; i < 10000; i += 1000) AMTK_VISIBILITY.push(i)
                                         AMTK_VISIBILITY.push(9999)

// Список вариантов осадков

const AMTK_PRECIPITATION = [
  'DZ',
  'RA',
  'SN',
  'SG',
  'PL',
  'GS',
  'GR',
  'DZ',
  'RA',
  'SN',
  'SG',
  'PL',
  'GS',
  'GR',
  'RASN',
  'SNRA',
  'SHSN',
  'SHRA',
  'SHGR',
  'FZRA',
  'FZDZ',
  'TSRA',
  'TSGR',
  'TSGS',
  'TSSN',
  'DS',
  'SS',
]

// Список погодных явлений

const AMTK_PHENOMENA = [
  'FG',
  'FZFG',
  'VCFG',
  'MIFG',
  'PRFG',
  'BCFG',
  'BR',
  'HZ',
  'FU',
  'DRSN',
  'DRSA',
  'DRDU',
  'DU',
  'BLSN',
  'BLDU',
  'SQ',
  'IC',
  'TS',
  'VCTS',
  'VA',
]


// Список параметров интенсивности облачности

const AMTK_CLOUDS = [
  'SKC',
  'NSC',
  'FEW',
  'SCT',
  'BKN',
  'OVC',
]


// ############################################################# //
//  Core code                                                    //
// ############################################################# //


//
// AMTK_CreationForm
//
// Фасад, управляющий группами обработчиков
// для форм ввода и вывода текстовых сообщений.
// Позволяет динамически добавлять несколько типов обработчиков
// для полей, кнопок и переключателей,
// а также группировать их в логические группы,
// на основе которых автоматически обновляются выходные данные.
//
class AMTK_CreationForm {

  //
  // Конструктор класса
  //
  // @param {string} selector - CSS-селектор корневого DOM-элемента,
  //                            с которым работает форма.
  //
  // @param {object} [options={}] - дополнительные параметры:
  //   - input: имя input-формы (по умолчанию 'amtk_input')
  //   - output: имя output-формы (по умолчанию 'amtk_output')
  //
  constructor(selector, options = {}) {
    // Корневой DOM-элемент
    this.root = document.querySelector(selector)

    // Объект с input- и output-формами
    this.forms = {
      input:  document.forms[options.input  ?? 'amtk_input'],
      output: document.forms[options.output ?? 'amtk_output'],
    }

    // Объект Map для хранения групп обработчиков
    this.groups = new Map()

    // Коллекция элементов input-формы
    this.elements = this.forms.input.elements
  }

  //
  // Добавляет новую группу обработчиков.
  // Используется внутри .addHandler().
  // Этот метод вряд ли имеет какой-либо смысл
  // использовать за пределами .addHandler(),
  // хотя такая возможность имеется.
  // @param {string} name - имя группы.
  //
  addGroup(name) {
    const { forms } = this
    const { elements } = forms.input

    this.groups.set(name, {
      forms,               // Ссылки на формы
      elements,            // Ссылки на элементы формы
      handlers: new Map(), // Map для обработчиков группы
    })
  }

  //
  // Добавляет обработчик к группе (создаёт группу, если её нет).
  // Это основной метод, который стоит использовать.
  //
  // @param {string} groupName - имя группы.
  //
  // @param {object} [options={}] - параметры обработчика:
  //
  //   - name: Имя input-элемента в HTML.
  //           По умолчанию совпадает с groupName.
  //
  //   - event: Тип события, на которое срабатывают обработчики.
  //            По умолчанию - это 'input' (.oninput).
  //
  //   - init: Функция инициализации.
  //           Если задана, то вызывается один раз.
  //           Применяется для обновления вывода
  //           сразу же после создания группы обработчиков.
  //           В качестве единственного аргумента в нее передается
  //           значение связанного с ней DOM-элемента.
  //
  //   - auxiliary: Вспомогательная функция.
  //                Если задана, то вызывается при каждом событии.
  //                Ничего не возвращает.
  //                В качестве первого аргумента в нее передается
  //                значение связанного с ней DOM-элемента.
  //                Вторым аргументом передается объект события.
  //                Может применяться, например, для обновления
  //                значения в текстовом input'е после перемещения
  //                связанного логически с ним слайдера и наоборот.
  //
  //   - format: Функция форматирования значения.
  //             Если задана, то вызывается при каждом событии.
  //             Возвращает строку со значением или пустую строку.
  //             В качестве первого аргумента в нее передается
  //             значение связанного с ней DOM-элемента.
  //             Вторым аргументом передается объект события.
  //             Возвращаемое функцией значение применяется к
  //             DOM-элементу в качестве его значения.
  //             Функция используется исключительно
  //             для форматирования пользовательского ввода.
  //             Прямого влияния на вывод функция не оказывает.
  //
  //   - update: Функция обновления значения группы.
  //             Если задана, то вызывается при каждом событии.
  //             Возвращает строку со значением или пустую строку.
  //             В качестве первого аргумента в нее передается
  //             значение связанного с ней DOM-элемента.
  //             Вторым аргументом передается объект события.
  //             Возвращаемое функцией значение применяется к
  //             DOM-элементу в качестве его значения.
  //             Функция используется для обновления
  //             значения в группе обработчиков и
  //             результирующего выходного значения всей формы.
  //
  addHandler(groupName, options = {}) {

    // Если группы нет - создать её
    if (!this.groups.has(groupName)) {
      this.addGroup(groupName)
    }

    const handlerName = options.name ?? groupName
    const group = this.groups.get(groupName)
    const element = this.elements[handlerName]

    const { init, auxiliary, format, update } = options

    try {
      // Инициализация (однократно)
      if (init) {
        init.call(this, element.value)
        this.updateOutput()
      }

      // Основной обработчик события,
      // в котором поочереди срабатывают: auxiliary, format, input.
      // Каждая из этих функций выполняется только если она задана.
      element.addEventListener(options.event ?? 'input', (event) => {
        if (format) {
          element.value = format.call(this, element.value, event)
          group.value = element.value
        }
        if (auxiliary) {
          auxiliary.call(this, element.value, event)
        }
        if (update) {
          const value = update.call(this, element.value, event)
          group.value = value
        }
        this.updateOutput()
      })
    } catch (error) {
      // Логирование ошибок для отладки
      console.error(handlerName, groupName, element)
    }
  }

  /**
   * Обновляет значение output-формы на основе значений всех групп.
   */
  updateOutput() {
    const { report } = this.forms.output.elements
    const values = []

    // Собирает значения из всех групп
    for (const [name, group] of this.groups) {
      if (group.value != null) {
        values.push(group.value)
      }
    }
    // Обновляет поле вывода
    report.value = values.join(' ').replace(/\s{2,}/, ' ')
  }

}


// ############################################################# //
//  User code                                                    //
// ############################################################# //


// init

const amtk_metar_form = new AMTK_CreationForm('#metar_form')


// utils

function isEmpty(value) {
  return value == null || value == ''
}

function isNullable(value) {
  return +value === 0
}

function toUpperCase(value) {
  return value.toUpperCase()
}

function toLowerCase(value) {
  return value.toLowerCase()
}


// Фабрика функции, которая поволяет переиспользовать свой код,
// создав несколько функций с различными параметрами,
// сохраненными в замыкании.
function optionSelectionFabric(element, values) {
  return function() {
    for (const value of (values ?? [])) {
      const option = document.createElement('option')
      option.value = value
      option.textContent = value
      element.append(option)
    }
  }
}


// event handlers

// Тип сводки

// @todo metar cor
// @todo speci cor

function initType() {
  const { metar, speci } = this.elements
  const group = this.groups.get('type')
  for (const type of [metar, speci]) {
    if (type.checked) {
      group.value = type.value.toUpperCase()
      return
    }
  }
  group.value = ''
}

amtk_metar_form.addHandler('type', {
  name: 'metar',
  init: initType,
  update: toUpperCase,
})

amtk_metar_form.addHandler('type', {
  name: 'speci',
  init: initType,
  update: toUpperCase,
})


// ICAO

function updateICAO() {
  const { value } = this.elements.icao
  return value.length === 4 ? value.toUpperCase() : ''
}

amtk_metar_form.addHandler('icao', {

  auxiliary() {
    const { type } = this.elements
    const group = this.groups.get('type')
    group.value = type.value.toUpperCase()
  },

  format(value) {

    const variants = this.elements.icao_variants

    const search = value.toUpperCase()
                        .replace(/[^A-Z]/, '')
                        .slice(0, 4)

    const icaos = search
      ? AMTK_ICAOS.filter((icao) => icao.startsWith(search))
                                   .slice(0, 10)
      : []

    variants.innerHTML = ''
    if (icaos.length) {
      for (const icao of icaos) {
        const option = document.createElement('option')
        option.value = icao
        option.textContent = icao
        variants.append(option)
      }
      variants.disabled = false
    } else {
      const option = document.createElement('option')
      option.textContent = 'Не найдено'
      variants.append(option)
      variants.disabled = true
    }

    return search
  },

  update: updateICAO,

})

amtk_metar_form.addHandler('icao', {

  name: 'icao_variants',

  event: 'change',

  auxiliary(value, event) {
    const { icao } = this.elements
    icao.value = value.toUpperCase()
  },

  update: updateICAO,

})


// Дата и время

function updateDateTime() {
  const { date, time } = this.elements
  const dateValue = date.value.split('-').at(-1)
  const timeValue = time.value.replace(/:/, '')
  const value = dateValue + (timeValue + 'Z')
  return value.length === 7 ? value : ''
}

amtk_metar_form.addHandler('datetime', {
  name: 'date',
  update: updateDateTime,
})

amtk_metar_form.addHandler('datetime', {
  name: 'time',
  update: updateDateTime,
})

amtk_metar_form.addHandler('datetime', {

  name: 'current',

  event: 'click',

  auxiliary(value, event) {
    const { date, time } = this.elements
    const datetime = (new Date()).toISOString().split('T')
    date.value = datetime.at(0)
    time.value = datetime.at(1)?.slice(0, 5)
  },

  update: updateDateTime,

})


// Ветер

function updateWind() {
  const { units } = this.elements
  const { direction, speed, gust } = this.elements

  if (
    !isNullable(direction.value)
    && !isNullable(speed.value)
  ) {
    const unitsValue = units.value.toUpperCase()
    const directionValue = direction.value.padStart(3, '0')
    const speedValue = speed.value.padStart(2, '0')
    const gustValue = (
      !isNullable(gust.value)
      && +gust.value > +speedValue
    )
      ? 'G' + gust.value.padStart(2, '0')
      : ''
    return directionValue + speedValue + gustValue + unitsValue
  }

  return ''
}

amtk_metar_form.addHandler('wind', {
  name: 'mps',
  update: updateWind,
})

amtk_metar_form.addHandler('wind', {
  name: 'kt',
  update: updateWind,
})

amtk_metar_form.addHandler('wind', {

  name: 'direction',

  format(value) {
    const formated = value.replace(/[^0-9]/, '')
                          .slice(0, 3)

    return formated <= 350 ? formated : 350
  },

  auxiliary(value) {
    const { direction_range } = this.elements
    const { speed, speed_range } = this.elements
    const { gust, gust_range } = this.elements

    direction_range.value = isNullable(value)
      ? 0
      : Math.round(+value / 10) * 10

    if (+value === 0) {
      speed.value = 0
      speed_range.value = 0
      gust.value = 0
      gust_range.value = 0
    }
  },

  update: updateWind,

})

amtk_metar_form.addHandler('wind', {

  name: 'direction_range',

  auxiliary(value) {
    const { direction } = this.elements
    const { speed, speed_range } = this.elements
    const { gust, gust_range } = this.elements

    direction.value = value

    if (+value === 0) {
      speed.value = 0
      speed_range.value = 0
      gust.value = 0
      gust_range.value = 0
    }
  },

  update: updateWind,

})

amtk_metar_form.addHandler('wind', {

  name: 'speed',

  format(value) {
    return value.replace(/[^0-9]/, '')
                .slice(0, 2)
  },

  auxiliary(value) {
    const { speed_range } = this.elements
    speed_range.value = isNullable(value) ? 0 : +value
  },

  update: updateWind,

})

amtk_metar_form.addHandler('wind', {

  name: 'speed_range',

  auxiliary(value) {
    const { speed } = this.elements
    speed.value = value
  },

  update: updateWind,

})

amtk_metar_form.addHandler('wind', {

  name: 'gust',

  format(value) {
    return value.replace(/[^0-9]/, '')
                .slice(0, 2)
  },

  auxiliary(value) {
    const { gust_range } = this.elements
    gust_range.value = isNullable(value) ? 0 : +value
  },

  update: updateWind,

})

amtk_metar_form.addHandler('wind', {

  name: 'gust_range',

  auxiliary(value) {
    const { gust } = this.elements
    gust.value = value
  },

  update: updateWind,

})


// Видимость
// @todo CAVOK

function updateVisibility() {
  const { value } = this.elements.visibility
  return isNullable(value) ? '' : value
}

amtk_metar_form.addHandler('visibility', {

  format(value) {
    return value.replace(/\D/g, '').slice(0, 4)
  },

  auxiliary(value) {
    const { visibility_range } = this.elements

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

amtk_metar_form.addHandler('visibility', {

  name: 'visibility_range',

  init(value) {
    const { visibility_range } = this.elements
    visibility_range.setAttribute('max', AMTK_VISIBILITY.length - 1)
  },

  auxiliary(value) {
    const { visibility } = this.elements
    visibility.value = AMTK_VISIBILITY.at(+value)
  },

  update: updateVisibility,

})


// Осадки и явления погоды

const initPrecipitation = optionSelectionFabric(
  amtk_metar_form.elements.precipitation,
  AMTK_PRECIPITATION
)

const initPhenomena = optionSelectionFabric(
  amtk_metar_form.elements.phenomena,
  AMTK_PHENOMENA
)

function formatWeather(value) {
    const { intensity } = this.elements

    // символ, не в диапазоне от 'A' до 'Z' в начале строки
    // или не '+', не '-' и не в диапазоне от 'A' до 'Z' не в начале строки
    const formated = value.toUpperCase()
                          .replace(/(?<=^)[^-+A-Z]|(?<!^)[^A-Z ]/, '')
                          .replace(/^-\s/, '-')
                          .replace(/\s{2,}/g, ' ')

    const sign = formated.at(0)
    for (const checkbox of intensity) {
      checkbox.checked = checkbox.value === sign
    }

    return formated
}

function updateWeather() {
  const { value } = this.elements.weather
  return value.length > 1 ? value : ''
}

function auxiliaryIntensity(_, event) {
  const { weather, intensity } = this.elements
  for (const checkbox of intensity) {
    if (checkbox === event.target) {
      weather.value = (event.target.checked ? checkbox.value : '')
        + weather.value.replace(/[^A-Z ]/, '')
    } else {
      checkbox.checked = false
    }
  }
}

function auxiliaryWeather(value, event) {
  const { weather } = this.elements
  if (
    weather.value.length > 2
    || weather.value.length === 2 && weather.value.at(0) !== '!'
  ) {
    weather.value += ' '
  }
  weather.value += value.toUpperCase()
}

amtk_metar_form.addHandler('weather', {
  format: formatWeather,
  update: updateWeather,
})

amtk_metar_form.addHandler('weather', {
  name: 'weather_minus',
  event: 'click',
  auxiliary: auxiliaryIntensity,
  update: updateWeather,
})

amtk_metar_form.addHandler('weather', {
  name: 'weather_plus',
  event: 'click',
  auxiliary: auxiliaryIntensity,
  update: updateWeather,
})

amtk_metar_form.addHandler('weather', {
  name: 'precipitation',
  init: initPrecipitation,
  event: 'change',
  auxiliary: auxiliaryWeather,
  update: updateWeather,
})

amtk_metar_form.addHandler('weather', {
  name: 'phenomena',
  init: initPhenomena,
  event: 'change',
  auxiliary: auxiliaryWeather,
  update: updateWeather,
})


// Облачность
// @todo 4 слоя

const initClouds = optionSelectionFabric(
  amtk_metar_form.elements.clouds_variants,
  AMTK_CLOUDS
)

function formatClouds(value) {
  return value.toUpperCase()
              .replace(/[^A-Z\d]/, '')
}

function updateClouds() {
  const { value } = this.elements.clouds
  if (value.length > 5) {
    return value
  }
}

function auxiliaryClouds() {
  const { elements } = amtk_metar_form // @todo <- это очень плохо!
  const { clouds, height } = elements
  const variants = elements.clouds_variants
  const types = elements.clouds_type

  let variantValue = ''
  for (const variant of variants.options) {
    if (variant.selected) {
      variantValue = variant.value.toUpperCase()
      break
    }
  }

  const heightValue = height.value.padStart(3, '0')

  let typeValue = ''
  for (const type of types) {
    if (type.checked) {
      typeValue = type.value.toUpperCase()
      break
    }
  }

  clouds.value = variantValue + heightValue + typeValue
}

function auxiliaryCloudsType(_, event) {
  const types = this.elements.clouds_type
  for (const type of types) {
    if (type !== event.target) {
      type.checked = false
      continue
    }
  }
  auxiliaryClouds()
}

amtk_metar_form.addHandler('clouds', {

  name: 'clouds',

  format: formatClouds,

  auxiliary(value) {
    let slice = ''

    // изменение ползунка height
    const { height } = this.elements
    slice = value.replace(/\D/g, '').slice(0, 3)
    const number = isNullable(slice) ? 0 : +slice
    height.value = number > 100 ? 100 : number

    // выбор соответствующего cloud variant
    const variants = this.elements.clouds_variants
    slice = value.slice(0, 3)
    for (const variant of variants.options) {
      if (variant.value === slice) {
        variants.value = variant.value
        break
      }
    }

    // выбор соответствующего cloud type
    const types = this.elements.clouds_type
    slice = value.replace(/\s/g, '').slice(6)

    for (const type of types) {
      type.checked = type.value === slice
    }

  },

  update: updateClouds,

})

amtk_metar_form.addHandler('clouds', {
  name: 'height',
  auxiliary: auxiliaryClouds,
  update: updateClouds,
})

amtk_metar_form.addHandler('clouds', {
  name: 'clouds_variants',
  init: initClouds,
  event: 'change',
  auxiliary: auxiliaryClouds,
  update: updateClouds,
})

amtk_metar_form.addHandler('clouds', {
  name: 'cb',
  event: 'click',
  auxiliary: auxiliaryCloudsType,
  update: updateClouds,
})

amtk_metar_form.addHandler('clouds', {
  name: 'tcu',
  event: 'click',
  auxiliary: auxiliaryCloudsType,
  update: updateClouds,
})


// температура

function formatTemperature(value) {
  value = +value.match(/-?\d?\d?/)
  return value < -80 ? -80
       : value >  60 ?  60
       : value
}

function auxiliaryTemperature(value, event) {

  const { temperature, temperature_range } = this.elements
  const { dew_point,   dew_point_range   } = this.elements

  let range = null

  switch (event.target) {
    case (temperature): range = temperature_range; break
    case (dew_point):   range = dew_point_range;   break
    default: return
  }

  range.value = value
}

function auxiliaryTemperatureRange(value, event) {
  const { temperature, temperature_range } = this.elements
  const { dew_point,   dew_point_range   } = this.elements

  let input = null

  switch (event.target) {
    case (temperature_range): input = temperature; break
    case (dew_point_range):   input = dew_point;   break
    default: return
  }

  input.value = value
}

function updateTemperature(value, event) {
  const { temperature, dew_point } = this.elements

  const temperatureMinus = +temperature.value < 0
  const dewPointMinus = +dew_point.value < 0

  const temperatureValue = (temperatureMinus ? 'M' : '')
    + Math.abs(+temperature.value).toString().padStart(2, '0')

  const dewPointValue = (dewPointMinus ? 'M' : '')
    + Math.abs(+dew_point.value).toString().padStart(2, '0')

  return temperatureValue.length || dewPointValue.length
    ? `${temperatureValue}/${dewPointValue}`
    : ''
}

amtk_metar_form.addHandler('temperature', {
  format: formatTemperature,
  auxiliary: auxiliaryTemperature,
  update: updateTemperature,
})

amtk_metar_form.addHandler('temperature', {
  name: 'temperature_range',
  auxiliary: auxiliaryTemperatureRange,
  update: updateTemperature,
})

amtk_metar_form.addHandler('temperature', {
  name: 'dew_point',
  format: formatTemperature,
  auxiliary: auxiliaryTemperature,
  update: updateTemperature,
})

amtk_metar_form.addHandler('temperature', {
  name: 'dew_point_range',
  auxiliary: auxiliaryTemperatureRange,
  update: updateTemperature,
})


// давление

function updatePressure(value, event) {
  return 'Q' + value.padStart(4, '0')
}

amtk_metar_form.addHandler('pressure', {

  format(value) {
    return value.replace(/\D/g, '').slice(0, 4)
  },

  auxiliary(value) {
    const range = this.elements.pressure_range

    value = +value

    range.value = value <  500 ?  500
                : value > 1100 ? 1100
                : value
  },

  update: updatePressure,
})

amtk_metar_form.addHandler('pressure', {

  name: 'pressure_range',

  auxiliary(value) {
    const { pressure } = this.elements
    pressure.value = value
  },

  update: updatePressure,

})
