
// file: src/components/metar_icao.mjs

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
