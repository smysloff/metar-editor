
// file: src/components/metar/wind/wind.mjs

// @todo VRB
// @todo рефакторинг и декомпозиция

const { min, round } = Math


export default function(form) {

  form.addHandler('wind', {
    element: 'calm',
    auxiliary,
    update,
  })

  form.addHandler('wind', {
    element: 'units',
    init,
    update,
  })

  form.addHandler('wind', {
    element: 'direction',
    format,
    auxiliary,
    update,
  })

  form.addHandler('wind', {
    element: 'speed',
    format,
    auxiliary,
    update,
  })

  form.addHandler('wind', {
    element: 'gust',
    format,
    auxiliary,
    update,
  })

  form.addHandler('wind', {
    element:  'direction_range',
    auxiliary: auxiliaryRange,
    update,
  })

  form.addHandler('wind', {
    element:  'speed_range',
    auxiliary: auxiliaryRange,
    update,
  })

  form.addHandler('wind', {
    element:  'gust_range',
    auxiliary: auxiliaryRange,
    update,
  })

  form.addHandler('wind', {
    element: 'vrb',
    auxiliary,
    update,
  })

}


// Main Functions //

function init(elements) {
  for (const element of elements) {
    element.checked = element.value === 'MPS'
  }
}

function format(value, element) {

  const { direction, speed, gust} = this.elements

  switch (element) {

    case direction:
      return formatDirection(value)

    case speed:
    case gust:
      return formatSpeed(value)

    default:
      throw new Error(`Can't find 'format' handler for element ${ element }`)
  }

}

function auxiliary(value, element) {

  const { direction, direction_range } = this.elements
  const { speed, speed_range } = this.elements
  const { gust, gust_range } = this.elements
  const { units, calm, vrb } = this.elements

  if (element === calm && element.checked) {
    direction.value = ''
    speed.value = ''
    gust.value = ''
    direction_range.value = -10
    speed_range.value = -1
    gust_range.value = -1
    vrb.checked = false
    return
  }

  calm.checked = false

  if (element.checked) {
    direction.value = ''
    direction_range.value = '-10'
    return
  }

  if (element === direction) {
    vrb.checked = false
    direction_range.value = value === '' ? -10 : value
    return
  }

  if (element === speed) {
    speed_range.value = value === '' ? -1 : value
    return
  }

  if (element === gust) {
    gust_range.value = value === '' ? -1 : value
    return
  }

}

function auxiliaryRange(value, element) {

  const { calm } = this.elements
  calm.checked = false

  const { direction, speed, gust } = this.elements
  const { direction_range, speed_range, gust_range } = this.elements

  const { vrb } = this.elements
  if (element === direction_range) {
    vrb.checked = false
  }

  switch (element) {
    case direction_range:
      direction.value = value === '-10' ? '' : parseInt(value); break

    case speed_range:
      speed.value = value === '-1' ? '' : parseInt(value); break

    case gust_range:
      gust.value = value === '-1' ? '' : parseInt(value); break
  }

}

function update(_, element) {

  const { direction, speed, gust } = this.elements
  const { direction_range, speed_range, gust_range } = this.elements
  const { units, vrb, calm } = this.elements

  if (element === calm && element.checked) {
    return element.value
  }

  let result = ''

  if (
    (direction.value === '' && !vrb.checked)
    || speed.value === ''
  ) {
    return result
  }

  result += vrb.checked
    ? vrb.value
    : roundTo(direction.value, 10).toString().padStart(3, '0')

  result += speed.value.padStart(2, '0')

  if (
    Number(gust.value)
    && Number(gust.value) > Number(speed.value)
    && !(Number(direction.value) === 0 && Number(speed.value) === 0)
  ) {
    result += `G${ gust.value }`
  }

  for (const unit of units) {
    if (unit.checked) {
      result += `${ unit.value }`; break
    }
  }

  return result
}


// Util Functions //

function roundTo(value, precision = 1) {
  value = roundTo(Number(value) / precision) * precision
}

function formatDirection(value) {

  const digitLength = 3
  const maxDegrees = 360

  value = value.trim()
               .replace(/\D/g, '')
               .substring(0, digitLength)

  value = parseInt(value)

  return isNaN(value) ? '' : min(value, maxDegrees)
}

function formatSpeed(value) {

  const digitLength = 2

  value = value.trim()
               .replace(/\D/g, '')
               .substring(0, digitLength)

  value = parseInt(value)

  return isNaN(value) ? '' : value
}
