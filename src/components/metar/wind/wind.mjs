
// file: src/components/metar/wind/wind.mjs

// @todo рефакторинг и декомпозиция


import { roundTo } from '../../../core/utils.mjs'

const { min, round } = Math


export default function(form) {

  form.addHandler('wind', {
    element: 'units',
    init,
    update,
  })

  form.addHandler('wind', {
    element: 'calm',
    auxiliary: calmHandler,
    update,
  })

  form.addHandler('wind', {
    element: 'vrb',
    auxiliary: vrbHandler,
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
    element: 'direction_range',
    auxiliary,
    update,
  })

  form.addHandler('wind', {
    element: 'speed_range',
    auxiliary,
    update,
  })

  form.addHandler('wind', {
    element: 'gust_range',
    auxiliary,
    update,
  })

  form.addHandler('wind', {
    element: 'vrb_min',
    format,
    auxiliary,
    update,
  })

  form.addHandler('wind', {
    element: 'vrb_max',
    format,
    auxiliary,
    update,
  })

  form.addHandler('wind', {
    element: 'vrb_min_range',
    auxiliary,
    update,
  })

  form.addHandler('wind', {
    element: 'vrb_max_range',
    auxiliary,
    update,
  })

}

function init(elements) {
  for (const element of elements) {
    element.checked = element.value === 'MPS'
  }
}


function calmHandler(value, element) {
  const { vrb } = this.elements
  if (element.checked) {
    vrb.checked = false
  }
}

function vrbHandler(value, element) {
  const { calm } = this.elements
  if (element.checked) {
    calm.checked = false
  }
}


function format(value, element) {

  const { direction, vrb_min, vrb_max } = this.elements
  const { speed, gust } = this.elements

  const directions = [direction, vrb_min, vrb_max]
  const speeds = [speed, gust]

  let trimmed = value.trim()
                     .replace(/\D/g, '')

  if (directions.includes(element)) {
    trimmed = trimmed.substring(0, 3)
    return Number(trimmed) > 360 ? 360 : trimmed
  }

  if (speeds.includes(element)) {
    trimmed = trimmed.substring(0, 2)
    return trimmed
  }

  return ''
}


function auxiliary(value, element) {

  const { direction, direction_range } = this.elements
  const { speed, speed_range } = this.elements
  const { gust, gust_range } = this.elements
  const { vrb_min, vrb_min_range } = this.elements
  const { vrb_max, vrb_max_range } = this.elements

  if (element === direction) {
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

  if (element === vrb_min) {
    vrb_min_range.value = value === '' ? -10 : value
    return
  }

  if (element === vrb_max) {
    vrb_max_range.value = value === '' ? -10 : value
    return
  }

  value = Number(value)

  if (element === direction_range) {
    direction.value = value === -10 ? '' : round(value / 10) * 10
    return
  }

  if (element === vrb_min_range) {
    vrb_min.value = value === -10 ? '' : round(value / 10) * 10
    return
  }

  if (element === vrb_max_range) {
    vrb_max.value = value === -10 ? '' : round(value / 10) * 10
    return
  }

  if (element === speed_range) {
    speed.value = value === -1 ? '' : value
    return
  }

  if (element === gust_range) {
    gust.value = value === -1 ? '' : value
    return
  }

}

function update(value, element) {

  const { units, calm, vrb } = this.elements
  const { direction, direction_range } = this.elements
  const { speed, speed_range } = this.elements
  const { gust, gust_range } = this.elements
  const { vrb_min, vrb_min_range } = this.elements
  const { vrb_max, vrb_max_range } = this.elements

  let result = ''

  if (calm.checked) {
    return calm.value
  }

  if (speed.value === '') {
    return result
  }

  if (
        vrb.checked &&
     (  (Number(speed.value) <= 1 && units.value === 'MPS')
     || (Number(speed.value) <= 3 && units.value === 'KT') )
  ) {
    result += vrb.value
  } else {
    result += direction.value.padStart(3, '0')
  }

  if (
       (Number(speed.value) >= 49 && units.value === 'MPS')
    || (Number(speed.value) >= 99 && units.value === 'KT')
  ) {
    result += 'P'
  }
  result += speed.value.padStart(2, '0')

  if (gust.value > speed.value) {
    result += 'G'
    if (
         (Number(gust.value) >= 49 && units.value === 'MPS')
      || (Number(gust.value) >= 99 && units.value === 'KT')
    ) {
      result += 'P'
    }
    result += gust.value.padStart(2, '0')
  }

  result += units.value

  if (
       vrb.checked
    && vrb_min.value !== ''
    && vrb_max.value !== ''
    && Number(vrb_max.value) > Number(vrb_min.value)
  ) {
    const vrb_min_val = vrb_min.value.padStart(3, '0')
    const vrb_max_val = vrb_max.value.padStart(3, '0')
    result += ` ${ vrb_min_val }V${ vrb_max_val }`
  }

  return result
}
