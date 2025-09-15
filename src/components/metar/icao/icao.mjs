
// file: src/components/metar/icao/icao.mjs

// Список кодов ICAO для поисковых подсказок

export default [
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

function update() {
  const { icao } = this.elements
  const { value } = icao
  return value.length === 4 ? value : ''
}

export default function(form) {

  // @todo cursor position
  form.addHandler('icao', {
    format(value) {
      return value.trim()
                  .toUpperCase()
                  .replace(/[^A-Z]/, '')
                  .substring(0, 4)
    },
    auxiliary: updateAssumptions,
    update,
  })

  form.addHandler('icao', {
    element: 'icao_variants',
    init: updateAssumptions,
    auxiliary(value) {
      const { icao } = this.elements
      icao.value = value
    },
    update,
  })

}
