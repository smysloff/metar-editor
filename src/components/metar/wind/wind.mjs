
// file: src/components/metar/wind/wind.mjs

// @todo VRB
// @todo рефакторинг и декомпозиция

const { min } = Math


export default function(form) {

  form.addHandler('wind', {
    element: 'calm',
    auxiliary: auxiliaryCalm,
    update: updateCalm,
  })

  form.addHandler('wind', {
    element: 'units',
    init: initUnits,
    update: updateWind,
  })

  form.addHandler('wind', {
    element: 'direction',
    format: formatDirection,
    auxiliary: auxiliaryDirection,
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

  form.addHandler('wind', {
    element: 'vrb',
    auxiliary: auxiliaryVrb,
    update: updateWind,
  })

}


// Main Functions //

function auxiliaryCalm(value, element) {

  const { units } = this.elements
  const { direction, speed, gust } = this.elements
  const { direction_range, speed_range, gust_range } = this.elements
  const { vrb } = this.elements

  if (element.checked) {
    direction.value = ''
    speed.value = ''
    gust.value = ''
    direction_range.value = -10
    speed_range.value = -1
    gust_range.value = -1
    vrb.checked = false
  }

}

function updateCalm(_, element) {
  return element.checked ? 'CALM' : ''
}

function initUnits(elements) {
  for (const element of elements) {
    element.checked = element.value === 'MPS'
  }
}

function formatDirection(value) {

  value = parseInt(
    value.trim()
         .replace(/\D/, '')
         .substring(0, 3)
  )

  return isNaN(value) ? '' : min(value, 360)
}

function auxiliaryDirection(value) {
  const range = this.elements.direction_range
  range.value = value === '' ? -10 : value
}





function updateWind() {

  const { direction, speed, gust } = this.elements
  const { direction_range, speed_range, gust_range } = this.elements
  const { units, vrb } = this.elements

  let result = ''

  if (
    (direction.value === '' && !vrb.checked)
    || speed.value === ''
  ) {
    return result
  }

  result += vrb.checked
    ? vrb.value
    : vrb.value.padStart(3, '0')

  result += speed.value.padStart(2, '0')

  //result += `${direction.value.padStart(3, '0')}${speed.value.padStart(2, '0')}`

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

function auxiliaryVrb(_, element) {
  const { direction } = this.elements
  const range = this.elements.direction_range
  if (element.checked) {
    direction.value = ''
    range.value = '-10'
  }
}
