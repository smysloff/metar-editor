
// file: src/components/metar/wind/wind.mjs

// @todo VRB

function updateWind() {

  const { direction, speed, gust } = this.elements
  const { direction_range, speed_range, gust_range } = this.elements
  const { units, vrb } = this.elements

  let result = ''

  if (direction.value === '' || speed.value === '') {
    return result
  }

  result += `${direction.value.padStart(3, '0')}${speed.value.padStart(2, '0')}`

  if (Number(gust.value) > Number(speed.value)) {
    result += `G${ gust.value }`
  }

  for (const unit of units) {
    if (unit.checked) {
      result += `${ unit.value }`; break
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

export default function(form) {

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

}
