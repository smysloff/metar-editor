
// file: src/components/metar/icao/icao.mjs

import { getIcaos } from '../../../core/utils.mjs'


function clearIcao() {
  const { icao } = this.elements
  icao.value = ''
}

function clearVariants(addDefaultOption = false) {

  const variants = this.elements.icao_variants
  variants.options.length = 0

  if (addDefaultOption) {
    const option = document.createElement('option')
    option.textContent = 'Не найдено'
    option.disabled = true
    option.selected = true
    variants.add(option)
  }
}

function clearAll() {
  clearIcao.call(this)
  clearVariants.call(this, true)
}

async function updateAssumptions() {

  const { icao } = this.elements
  const variants = this.elements.icao_variants
  const value = icao.value.trim().toUpperCase()

  if (value.length === 0) {
    clearAll.call(this)
    return
  }

  clearVariants.call(this)

  try {

    const icaos = await getIcaos(value)
    let isMatchesFounded = false

    for (const icaoCode of icaos) {
      if (icaoCode.startsWith(value)) {
        isMatchesFounded = true
        const option = document.createElement('option')
        option.value = icaoCode
        option.textContent = icaoCode
        variants.add(option)
      }
    }

    if (!isMatchesFounded) {
      clearVariants.call(this, true)
    }

  } catch (error) {

    console.error('Error updating ICAO assumptions:', error)

    if (variants.options.length > 0) {
      variants.options[0].textContent = 'Ошибка загрузки'
    } else {
      const option = document.createElement('option')
      option.textContent = 'Ошибка загрузки'
      option.disabled = true
      option.selected = true
      variants.add(option)
    }

  }

}

function update() {
  const { icao } = this.elements
  const value = icao.value.trim().toUpperCase()
  return value.length === 4 ? value : ''
}

export default function(form) {

  // @todo отслеживать позицию курсора при печати
  // @todo кеширование кодов ICAO из БД
  // @todo рефакторинг и декомпозиция

  form.addHandler('icao', {
    format(value) {
      return value.trim()
                  .toUpperCase()
                  .replace(/[^A-Z]/g, '')
                  .substring(0, 4)
    },
    auxiliary: updateAssumptions,
    update,
  })

  form.addHandler('icao', {
    element: 'icao_variants',
    init: updateAssumptions,
    auxiliary(value, element) {
      const { icao } = this.elements
      icao.value = value
    },
    update,
  })

}
