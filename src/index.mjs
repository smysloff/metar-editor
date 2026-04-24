
// file: src/index.mjs


// Импорты модулей

import FormManager      from './core/form_manager.mjs'
import loadForm         from './app/main/main.mjs' // @todo

import METAR_COMPONENTS from './components/metar/metar.mjs'
//import TAF_COMPONENTS   from './components/taf/taf.mjs'


// Константы

const METAR_FORM_SELECTOR = '#amtk_wre_metar'
const TAF_FORM_SELECTOR   = '#amtk_wre_taf'


// Списки названий компонентов,
// по которым будут искаться и загружаться в формы
// необходимые для них компоненты

const METAR_COMPONENTS_NAMES = [
  'type',
  'cor',
  'icao',
  'datetime',
  'nil',
  'auto',
  'wind',
  'cavok',
  'visibility',
  'visibility_minimal',
  'weather',
  'visibility_vertical',
  'clouds',
  'temperature',
  'pressure',
  //'trend',
  'rmk',
]

//const TAF_COMPONENTS_NAMES = [
//  // type,
//  // ...
//]


// Создание форм
// и отрисовка компонентов в них

const METAR_FORM = new FormManager(
  METAR_FORM_SELECTOR,
  METAR_COMPONENTS,
  METAR_COMPONENTS_NAMES
)

//const TAF_FORM = new FormManager(
//  TAF_FORM_SELECTOR,
//  TAF_COMPONENTS,
//  TAF_COMPONENTS_NAMES
//)


// Загрузка логики приложения

loadForm(METAR_FORM)
//loadForm(TAF_FORM)


// Логика меню

//const entries = [
//  {
//    btn: document.querySelector('#amtk_wre_menu_btn_metar'),
//    form: document.querySelector('#amtk_wre_metar'),
//  },
//  {
//    btn: document.querySelector('#amtk_wre_menu_btn_taf'),
//    form: document.querySelector('#amtk_wre_taf'),
//  },
//]
//
//for (const {btn, form} of entries) {
//  btn.addEventListener('click', e => {
//    entries.forEach(entry => {
//      if (entry.btn === e.target) {
//        entry.form.classList.remove('amtk_wre_hidden')
//        entry.btn.classList.add('amtk_wre_active')
//      } else {
//        entry.form.classList.add('amtk_wre_hidden')
//        entry.btn.classList.remove('amtk_wre_active')
//      }
//    })
//  })
//}
