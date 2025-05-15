"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
// * Core libraries code
// * User space code
// ** utils
// ** init
// ** event handlers
// *** тип сводки
// *** icao
// *** дата и время
// *** Ветер
// *** Видимость
// *** Явления погоды
// *** Облачность
// *** Температура
// *** Давление

// ############################################################# //
//  Globals                                                      //
// ############################################################# //

// ICAO list for search tips
var ICAOS = ['HKHB', 'HRYR', 'TAPT', 'UEEA', 'UEEE', 'UELL', 'UERP', 'UERR', 'UESO', 'UESS', 'UEST', 'UHBB', 'UHBI', 'UHBW', 'UHHH', 'UHKK', 'UHMA', 'UHMD', 'UHMM', 'UHMP', 'UHNN', 'UHOO', 'UHPP', 'UHSS', 'UHWW', 'UIAA', 'UIBB', 'UIBS', 'UIII', 'UITT', 'UIUU', 'ULAA', 'ULAM', 'ULAS', 'ULBC', 'ULDD', 'ULKK', 'ULLI', 'ULMK', 'ULMM', 'ULNN', 'ULOL', 'ULOO', 'ULPB', 'ULSS', 'ULWU', 'ULWW', 'UMKK', 'UNAA', 'UNBB', 'UNEE', 'UNII', 'UNKL', 'UNKS', 'UNKY', 'UNNT', 'UNOO', 'UNSS', 'UNTT', 'UNWW', 'UODD', 'UOHH', 'UOII', 'URKA', 'URKG', 'URKK', 'URMG', 'URML', 'URMM', 'URMN', 'URMO', 'URMT', 'URRR', 'URRY', 'URSS', 'URWA', 'URWI', 'URWW', 'USCC', 'USCM', 'USDD', 'USHU', 'USII', 'USKK', 'USMM', 'USMU', 'USNN', 'USNR', 'USPP', 'USRK', 'USRN', 'USRO', 'USRR', 'USSS', 'USTO', 'USTJ', 'USTR', 'USUU', 'UUBA', 'UUBB', 'UUBC', 'UUBI', 'UUBK', 'UUBP', 'UUBS', 'UUBT', 'UUDD', 'UUDL', 'UUEE', 'UUEM', 'UUOB', 'UUOK', 'UUOL', 'UUOO', 'UUOR', 'UUOT', 'UUWR', 'UUWW', 'UUYH', 'UUYI', 'UUYP', 'UUYS', 'UUYW', 'UUYY', 'UWGG', 'UWKB', 'UWKD', 'UWKE', 'UWKJ', 'UWKS', 'UWLW', 'UWOO', 'UWOR', 'UWPP', 'UWPS', 'UWSB', 'UWSS', 'UWUB', 'UWUF', 'UWUK', 'UWUU', 'UWWW'];

// Visibility Values
var VISIBILITY_VALUES = [];
for (var i = 0; i < 800; i += 50) VISIBILITY_VALUES.push(i);
for (var _i = 800; _i < 5000; _i += 100) VISIBILITY_VALUES.push(_i);
for (var _i2 = 5000; _i2 < 10000; _i2 += 1000) VISIBILITY_VALUES.push(_i2);
VISIBILITY_VALUES.push(9999);

// ############################################################# //
//  Core libraries code                                          //
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
var AMTK_CreationForm = /*#__PURE__*/function () {
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
  function AMTK_CreationForm(selector) {
    var _options$input, _options$output;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, AMTK_CreationForm);
    // Корневой DOM-элемент
    this.root = document.querySelector(selector);

    // Объект с input- и output-формами
    this.forms = {
      input: document.forms[(_options$input = options.input) !== null && _options$input !== void 0 ? _options$input : 'amtk_input'],
      output: document.forms[(_options$output = options.output) !== null && _options$output !== void 0 ? _options$output : 'amtk_output']
    };

    // Объект Map для хранения групп обработчиков
    this.groups = new Map();

    // Коллекция элементов input-формы
    this.elements = this.forms.input.elements;
  }

  //
  // Добавляет новую группу обработчиков.
  // Используется внутри .addHandler().
  // Этот метод вряд ли имеет какой-либо смысл
  // использовать за пределами .addHandler(),
  // хотя такая возможность имеется.
  // @param {string} name - имя группы.
  //
  return _createClass(AMTK_CreationForm, [{
    key: "addGroup",
    value: function addGroup(name) {
      var forms = this.forms;
      var elements = forms.input.elements;
      this.groups.set(name, {
        forms: forms,
        // Ссылки на формы
        elements: elements,
        // Ссылки на элементы формы
        handlers: new Map() // Map для обработчиков группы
      });
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
  }, {
    key: "addHandler",
    value: function addHandler(groupName) {
      var _options$name,
        _this = this;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      // Если группы нет - создать её
      if (!this.groups.has(groupName)) {
        this.addGroup(groupName);
      }
      var handlerName = (_options$name = options.name) !== null && _options$name !== void 0 ? _options$name : groupName;
      var group = this.groups.get(groupName);
      var element = this.elements[handlerName];
      var init = options.init,
        auxiliary = options.auxiliary,
        format = options.format,
        update = options.update;
      try {
        var _options$event;
        // Инициализация (однократно)
        if (init) {
          init.call(this, element.value);
          this.updateOutput();
        }

        // Основной обработчик события,
        // в котором поочереди срабатывают: auxiliary, format, input.
        // Каждая из этих функций выполняется только если она задана.
        element.addEventListener((_options$event = options.event) !== null && _options$event !== void 0 ? _options$event : 'input', function (event) {
          if (format) {
            element.value = format.call(_this, element.value, event);
            group.value = element.value;
          }
          if (auxiliary) {
            auxiliary.call(_this, element.value, event);
          }
          if (update) {
            var value = update.call(_this, element.value, event);
            group.value = value;
          }
          _this.updateOutput();
        });
      } catch (error) {
        // Логирование ошибок для отладки
        console.error(handlerName, groupName, element);
      }
    }

    /**
     * Обновляет значение output-формы на основе значений всех групп.
     */
  }, {
    key: "updateOutput",
    value: function updateOutput() {
      var report = this.forms.output.elements.report;
      var values = [];

      // Собирает значения из всех групп
      var _iterator = _createForOfIteratorHelper(this.groups),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
            name = _step$value[0],
            group = _step$value[1];
          if (group.value != null) {
            values.push(group.value);
          }
        }
        // Обновляет поле вывода
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      report.value = values.join(' ').replace(/\s{2,}/, ' ');
    }
  }]);
}(); // ############################################################# //
//  User space code                                              //
// ############################################################# //
// utils
function isEmpty(value) {
  return value == null || value == '';
}
function isNotEmpty(value) {
  return !isEmpty(value);
}
function toUpperCase(value) {
  return value.toUpperCase();
}

// init

var amtk_form = new AMTK_CreationForm('#metar_form');

// event handlers

// тип сводки

// @todo metar cor
// @todo speci cor

function initType() {
  var _this$elements = this.elements,
    metar = _this$elements.metar,
    speci = _this$elements.speci;
  var group = this.groups.get('type');
  for (var _i3 = 0, _arr = [metar, speci]; _i3 < _arr.length; _i3++) {
    var type = _arr[_i3];
    if (type.checked) {
      group.value = type.value.toUpperCase();
      return;
    }
  }
  group.value = '';
}
amtk_form.addHandler('type', {
  name: 'metar',
  init: initType,
  update: toUpperCase
});
amtk_form.addHandler('type', {
  name: 'speci',
  init: initType,
  update: toUpperCase
});

// icao

function updateICAO() {
  var value = this.elements.icao.value;
  return value.length === 4 ? value.toUpperCase() : '';
}
amtk_form.addHandler('icao', {
  auxiliary: function auxiliary() {
    var type = this.elements.type;
    var group = this.groups.get('type');
    group.value = type.value.toUpperCase();
  },
  format: function format(value) {
    var variants = this.elements.icao_variants;
    var search = value.toUpperCase().replace(/[^A-Z]/, '').slice(0, 4);
    var icaos = search ? ICAOS.filter(function (icao) {
      return icao.startsWith(search);
    }).slice(0, 10) : [];
    variants.innerHTML = '';
    if (icaos.length) {
      var _iterator2 = _createForOfIteratorHelper(icaos),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var icao = _step2.value;
          var option = document.createElement('option');
          option.value = icao;
          option.textContent = icao;
          variants.append(option);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      variants.disabled = false;
    } else {
      var _option = document.createElement('option');
      _option.textContent = 'Не найдено';
      variants.append(_option);
      variants.disabled = true;
    }
    return search;
  },
  update: updateICAO
});
amtk_form.addHandler('icao', {
  name: 'icao_variants',
  event: 'click',
  auxiliary: function auxiliary(value, event) {
    var icao = this.elements.icao;
    var variants = this.elements.icao_variants;
    console.log(event.target, event.currentTarget);
    if (event.target === variants) return;
    icao.value = value.toUpperCase();
  },
  update: updateICAO
});

// дата и время

function updateDateTime() {
  var _this$elements2 = this.elements,
    date = _this$elements2.date,
    time = _this$elements2.time;
  var dateValue = date.value.split('-').at(-1);
  var timeValue = time.value.replace(/:/, '');
  var value = dateValue + (timeValue + 'Z');
  return value.length === 7 ? value : '';
}
amtk_form.addHandler('datetime', {
  name: 'date',
  update: updateDateTime
});
amtk_form.addHandler('datetime', {
  name: 'time',
  update: updateDateTime
});
amtk_form.addHandler('datetime', {
  name: 'current',
  event: 'click',
  auxiliary: function auxiliary(value, event) {
    var _datetime$at;
    var _this$elements3 = this.elements,
      date = _this$elements3.date,
      time = _this$elements3.time;
    var datetime = new Date().toISOString().split('T');
    date.value = datetime.at(0);
    time.value = (_datetime$at = datetime.at(1)) === null || _datetime$at === void 0 ? void 0 : _datetime$at.slice(0, 5);
  },
  update: updateDateTime
});

// ветер

function updateWind() {
  var units = this.elements.units;
  var _this$elements4 = this.elements,
    direction = _this$elements4.direction,
    speed = _this$elements4.speed,
    gust = _this$elements4.gust;
  if (isNotEmpty(direction.value) && isNotEmpty(speed.value) && speed.value != 0) {
    var unitsValue = units.value.toUpperCase();
    var directionValue = direction.value.padStart(3, '0');
    var speedValue = speed.value.padStart(2, '0');
    var gustValue = isNotEmpty(gust.value) && +gust.value != 0 && +gust.value > +speedValue ? 'G' + gust.value.padStart(2, '0') : '';
    return directionValue + speedValue + gustValue + unitsValue;
  }
  return '';
}
amtk_form.addHandler('wind', {
  name: 'mps',
  update: updateWind
});
amtk_form.addHandler('wind', {
  name: 'kt',
  update: updateWind
});
amtk_form.addHandler('wind', {
  name: 'direction',
  format: function format(value) {
    var formated = value.replace(/[^0-9]/, '').slice(0, 3);
    return formated <= 350 ? formated : 350;
  },
  auxiliary: function auxiliary(value) {
    var direction_range = this.elements.direction_range;
    direction_range.value = isNotEmpty(value) || value != 0 ? Math.round(+value / 10) * 10 : 0;
  },
  update: updateWind
});
amtk_form.addHandler('wind', {
  name: 'direction_range',
  auxiliary: function auxiliary(value) {
    var direction = this.elements.direction;
    direction.value = value;
  },
  update: updateWind
});
amtk_form.addHandler('wind', {
  name: 'speed',
  format: function format(value) {
    return value.replace(/[^0-9]/, '').slice(0, 2);
  },
  auxiliary: function auxiliary(value) {
    var speed_range = this.elements.speed_range;
    speed_range.value = isNotEmpty(value) ? +value : 0;
  },
  update: updateWind
});
amtk_form.addHandler('wind', {
  name: 'speed_range',
  auxiliary: function auxiliary(value) {
    var speed = this.elements.speed;
    speed.value = value;
  },
  update: updateWind
});
amtk_form.addHandler('wind', {
  name: 'gust',
  format: function format(value) {
    return value.replace(/[^0-9]/, '').slice(0, 2);
  },
  auxiliary: function auxiliary(value) {
    var gust_range = this.elements.gust_range;
    gust_range.value = isNotEmpty(value) ? +value : 0;
  },
  update: updateWind
});
amtk_form.addHandler('wind', {
  name: 'gust_range',
  auxiliary: function auxiliary(value) {
    var gust = this.elements.gust;
    gust.value = value;
  },
  update: updateWind
});

// видимость

function updateVisibility() {
  var value = this.elements.visibility.value;
  return isNotEmpty(value) && value != 0 ? value : '';
}
amtk_form.addHandler('visibility', {
  format: function format(value) {
    return value.replace(/\D/g, '').slice(0, 4);
  },
  auxiliary: function auxiliary(value) {
    var visibility_range = this.elements.visibility_range;
    var visibilityValue = +value;
    var base = visibilityValue < 800 ? 50 : visibilityValue < 5000 ? 100 : visibilityValue < 9999 ? 1000 : 0;
    var visibilityRangeValue = VISIBILITY_VALUES.at(-1);
    if (base > 0) {
      var roundedValue = Math.floor(visibilityValue / base) * base;
      visibilityRangeValue = VISIBILITY_VALUES.indexOf(roundedValue);
    }
    visibility_range.value = visibilityRangeValue.toString();
  },
  update: updateVisibility
});
amtk_form.addHandler('visibility', {
  name: 'visibility_range',
  init: function init(value) {
    var visibility_range = this.elements.visibility_range;
    visibility_range.setAttribute('max', VISIBILITY_VALUES.length - 1);
  },
  auxiliary: function auxiliary(value) {
    var visibility = this.elements.visibility;
    visibility.value = VISIBILITY_VALUES.at(+value);
  },
  update: updateVisibility
});

// явления погоды

function updateWeather() {
  var value = this.elements.weather.value;
  return value.length > 1 ? value : '';
}
function auxiliaryWeatherIntensity(_, event) {
  var _this$elements5 = this.elements,
    weather = _this$elements5.weather,
    intensity = _this$elements5.intensity;
  var _iterator3 = _createForOfIteratorHelper(intensity),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var checkbox = _step3.value;
      if (checkbox === event.target) {
        weather.value = (event.target.checked ? checkbox.value : '') + weather.value.replace(/[^A-Z]/, '');
      } else {
        checkbox.checked = false;
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
}
function auxiliaryWeatherVariants(value, event) {
  var weather = this.elements.weather;
  var variants = this.elements.weather_variants;
  var phenomenas = this.elements.weather_phenomenas;
  if ([variants, phenomenas].includes(event.target)) {
    return;
  }
  weather.value += value.toUpperCase();
}
amtk_form.addHandler('weather', {
  format: function format(value) {
    var intensity = this.elements.intensity;

    // символ, не в диапазоне от 'A' до 'Z' в начале строки
    // или не '+', не '-' и не в диапазоне от 'A' до 'Z' не в начале строки
    var formated = value.toUpperCase().replace(/(?<=^)[^-+A-Z]|(?<!^)[^A-Z]/, '');
    var sign = formated.at(0);
    var _iterator4 = _createForOfIteratorHelper(intensity),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var checkbox = _step4.value;
        checkbox.checked = checkbox.value === sign;
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    return formated;
  },
  update: updateWeather
});
amtk_form.addHandler('weather', {
  name: 'weather_minus',
  event: 'click',
  auxiliary: auxiliaryWeatherIntensity,
  update: updateWeather
});
amtk_form.addHandler('weather', {
  name: 'weather_plus',
  event: 'click',
  auxiliary: auxiliaryWeatherIntensity,
  update: updateWeather
});
amtk_form.addHandler('weather', {
  name: 'weather_variants',
  event: 'click',
  auxiliary: auxiliaryWeatherVariants,
  update: updateWeather
});
amtk_form.addHandler('weather', {
  name: 'weather_phenomenas',
  event: 'click',
  auxiliary: auxiliaryWeatherVariants,
  update: updateWeather
});

// облака
// @todo 4 слоя

function updateClouds() {
  var value = this.elements.clouds.value;
  if (value.length > 5) {
    return value;
  }
}
function auxiliaryClouds(elements) {
  var clouds = elements.clouds,
    height = elements.height;
  var variants = elements.clouds_variants;
  var types = elements.clouds_type;
  var variantValue = '';
  var _iterator5 = _createForOfIteratorHelper(variants.options),
    _step5;
  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var variant = _step5.value;
      if (variant.selected) {
        variantValue = variant.value.toUpperCase();
        break;
      }
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }
  var heightValue = height.value.padStart(3, '0');
  var typeValue = '';
  var _iterator6 = _createForOfIteratorHelper(types),
    _step6;
  try {
    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
      var type = _step6.value;
      if (type.checked) {
        typeValue = type.value.toUpperCase();
        break;
      }
    }
  } catch (err) {
    _iterator6.e(err);
  } finally {
    _iterator6.f();
  }
  clouds.value = variantValue + heightValue + typeValue;
}
function auxiliaryCloudsType(_, event) {
  var types = this.elements.clouds_type;
  var _iterator7 = _createForOfIteratorHelper(types),
    _step7;
  try {
    for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
      var type = _step7.value;
      if (type !== event.target) {
        type.checked = false;
        continue;
      }
    }
  } catch (err) {
    _iterator7.e(err);
  } finally {
    _iterator7.f();
  }
  auxiliaryClouds(this.elements);
}
amtk_form.addHandler('clouds', {
  name: 'clouds',
  format: function format(value) {
    return value.toUpperCase().replace(/[^A-Z\d]/, '');
  },
  auxiliary: function auxiliary(value) {
    var slice = '';

    // изменение ползунка height
    var height = this.elements.height;
    slice = value.replace(/\D/g, '').slice(0, 3);
    var number = slice === '' ? 0 : parseInt(slice);
    height.value = number > 100 ? 100 : number;

    // выбор соответствующего cloud variant
    var variants = this.elements.clouds_variants;
    slice = value.slice(0, 3).toLowerCase();
    var _iterator8 = _createForOfIteratorHelper(variants.options),
      _step8;
    try {
      for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
        var variant = _step8.value;
        if (variant.value === slice) {
          variants.value = variant.value;
          break;
        }
      }

      // выбор соответствующего cloud type
    } catch (err) {
      _iterator8.e(err);
    } finally {
      _iterator8.f();
    }
    var types = this.elements.clouds_type;
    slice = value.replace(/\s/g, '').slice(6).toLowerCase();
    console.log(slice);
    var _iterator9 = _createForOfIteratorHelper(types),
      _step9;
    try {
      for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
        var type = _step9.value;
        type.checked = type.value === slice;
      }
    } catch (err) {
      _iterator9.e(err);
    } finally {
      _iterator9.f();
    }
  },
  update: updateClouds
});
amtk_form.addHandler('clouds', {
  name: 'height',
  auxiliary: function auxiliary(value) {
    auxiliaryClouds(this.elements);
  },
  update: updateClouds
});
amtk_form.addHandler('clouds', {
  name: 'clouds_variants',
  event: 'click',
  auxiliary: function auxiliary(value, event) {
    var _this$elements6 = this.elements,
      clouds = _this$elements6.clouds,
      height = _this$elements6.height;
    var variants = this.elements.clouds_variants;
    if (event.target === variants) {
      return;
    }
    auxiliaryClouds(this.elements);
  },
  update: updateClouds
});
amtk_form.addHandler('clouds', {
  name: 'cb',
  event: 'click',
  auxiliary: auxiliaryCloudsType,
  update: updateClouds
});
amtk_form.addHandler('clouds', {
  name: 'tcu',
  event: 'click',
  auxiliary: auxiliaryCloudsType,
  update: updateClouds
});

// температура

function formatTemperature(value) {
  value = +value.match(/-?\d?\d?/);
  return value < -80 ? -80 : value > 60 ? 60 : value;
}
function auxiliaryTemperature(value, event) {
  var _this$elements7 = this.elements,
    temperature = _this$elements7.temperature,
    temperature_range = _this$elements7.temperature_range;
  var _this$elements8 = this.elements,
    dew_point = _this$elements8.dew_point,
    dew_point_range = _this$elements8.dew_point_range;
  var range = null;
  switch (event.target) {
    case temperature:
      range = temperature_range;
      break;
    case dew_point:
      range = dew_point_range;
      break;
    default:
      return;
  }
  range.value = value;
}
function auxiliaryTemperatureRange(value, event) {
  var _this$elements9 = this.elements,
    temperature = _this$elements9.temperature,
    temperature_range = _this$elements9.temperature_range;
  var _this$elements0 = this.elements,
    dew_point = _this$elements0.dew_point,
    dew_point_range = _this$elements0.dew_point_range;
  var input = null;
  switch (event.target) {
    case temperature_range:
      input = temperature;
      break;
    case dew_point_range:
      input = dew_point;
      break;
    default:
      return;
  }
  input.value = value;
}
function updateTemperature(value, event) {
  var _this$elements1 = this.elements,
    temperature = _this$elements1.temperature,
    dew_point = _this$elements1.dew_point;
  var temperatureMinus = +temperature.value < 0;
  var dewPointMinus = +dew_point.value < 0;
  var temperatureValue = (temperatureMinus ? 'M' : '') + Math.abs(+temperature.value).toString().padStart(2, '0');
  var dewPointValue = (dewPointMinus ? 'M' : '') + Math.abs(+dew_point.value).toString().padStart(2, '0');
  return temperatureValue.length || dewPointValue.length ? "".concat(temperatureValue, "/").concat(dewPointValue) : '';
}
amtk_form.addHandler('temperature', {
  format: formatTemperature,
  auxiliary: auxiliaryTemperature,
  update: updateTemperature
});
amtk_form.addHandler('temperature', {
  name: 'temperature_range',
  auxiliary: auxiliaryTemperatureRange,
  update: updateTemperature
});
amtk_form.addHandler('temperature', {
  name: 'dew_point',
  format: formatTemperature,
  auxiliary: auxiliaryTemperature,
  update: updateTemperature
});
amtk_form.addHandler('temperature', {
  name: 'dew_point_range',
  auxiliary: auxiliaryTemperatureRange,
  update: updateTemperature
});

// давление

function updatePressure(value, event) {
  return 'Q' + value.padStart(4, '0');
}
amtk_form.addHandler('pressure', {
  format: function format(value) {
    return value.replace(/\D/g, '').slice(0, 4);
  },
  auxiliary: function auxiliary(value) {
    var range = this.elements.pressure_range;
    value = +value;
    range.value = value < 500 ? 500 : value > 1100 ? 1100 : value;
  },
  update: updatePressure
});
amtk_form.addHandler('pressure', {
  name: 'pressure_range',
  auxiliary: function auxiliary(value) {
    var pressure = this.elements.pressure;
    pressure.value = value;
  },
  update: updatePressure
});