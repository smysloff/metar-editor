
// file: src/components/metar/temperature/temperature.mjs

function formatTemperature(value) { // @todo fix bug -0

  value = value.trim()

  if (value === '-')
    return value

  if (value === '' || isNaN(value))
    return ''

  const number = +value.match(/-?\d?\d?/)

  if (isNaN(number) && value.startsWith('-'))
    return '-'

  return isNaN(number) ? '' 
       : number < -80  ? -80
       : number >  80  ?  80
       : number
}

function updateTemperature() {

  const { temperature, dew_point } = this.elements

  if (
    ['', '-'].includes(temperature.value)
    && ['', '-'].includes(dew_point.value)
  ) {
    return ''
  }

  const temperature_value =
    isNaN(+temperature.value) ? '' : temperature.value

  const dew_point_value =
    isNaN(+dew_point.value) ? '' : dew_point.value

  let result = ''

  result +=
    temperature_value === '' ? '/' : temperature_value.replace('-', 'M')

  result += '/'

  result +=
    dew_point_value === '' ? '/' : dew_point_value.replace('-', 'M')

  return result

}

function auxiliaryTemperature(value, element) {

  const { temperature, dew_point }             = this.elements
  const { temperature_range, dew_point_range } = this.elements
  const { temperature_minus, dew_point_minus } = this.elements

  let linkedElement = null
  let minusElement  = null

  switch (element) {

    case temperature:
      linkedElement = temperature_range
      minusElement  = temperature_minus
      break

    case dew_point:
      linkedElement = dew_point_range
      minusElement  = dew_point_minus
      break

    default: throw new TypeError(`unknown element`)
  }

  if (!(linkedElement instanceof HTMLInputElement)) {
    throw new TypeError('not an input element')
  }

  if (!(minusElement instanceof HTMLInputElement)) {
    throw new TypeError(
      `minusElement is not a proper HTMLInputElement`)
  }

  linkedElement.value = value === '' || value === '-'
      ? -1
      : Math.abs(value)

  minusElement.checked = value.startsWith('-')
}

function auxiliaryTemperatureRange(value, element) {

  const { temperature, dew_point }             = this.elements
  const { temperature_range, dew_point_range } = this.elements
  const { temperature_minus, dew_point_minus } = this.elements

  let linkedElement = ''
  let minusElement  = ''

  switch (element) {

    case temperature_range:
      linkedElement = temperature
      minusElement  = temperature_minus
      break

    case dew_point_range:
      linkedElement = dew_point
      minusElement  = dew_point_minus
      break

    default: throw new Error(`unknown element`)
  }

  if (
    !(linkedElement instanceof HTMLInputElement)
    || !('value' in linkedElement)
  ) {
    throw new TypeError(
      `linkedElement must be a typeof HTMLInputElement(text), but got ${typeof linkedElement}`)
  }

  if (
    !(minusElement instanceof HTMLInputElement)
    || minusElement?.type !== 'checkbox'
  ) {
    throw new TypeError(
      `minusElement must be a typeof HTMLInputElement(checkbox), but got ${typeof minusElement}`)
  }

  //if (value < 0) {
  //  linkedElement.value = ''
  //} else {
  //  if (minusElement.checked)
  //    value = `-${value}`
  //  linkedElement.value = value
  //}

  linkedElement.value = value < 0            ? ''          :
                        minusElement.checked ? `-${value}` :
                        /* default */          value
}

export default function(form) {

  form.addHandler('temperature', {
    element: 'temperature',
    format: formatTemperature,
    auxiliary: auxiliaryTemperature,
    update: updateTemperature,
  })

  form.addHandler('temperature', {
    element: 'dew_point',
    format: formatTemperature,
    auxiliary: auxiliaryTemperature,
    update: updateTemperature,
  })

  form.addHandler('temperature', {
    element: 'temperature_range',
    //auxiliary(value) { // @todo auxiliaryTemperatureRange
    //  const { temperature } = this.elements
    //  temperature.value = value < 0 ? '' : value
    //},
    auxiliary: auxiliaryTemperatureRange,
    update: updateTemperature,
  })

  form.addHandler('temperature', {
    element: 'dew_point_range',
    //auxiliary(value) { // @todo auxiliaryTemperatureRange
    //  const { dew_point } = this.elements
    //  dew_point.value = value < 0 ? '' : value
    //},
    auxiliary: auxiliaryTemperatureRange,
    update: updateTemperature,
  })

  function auxiliaryTemperatureMinus(_, element) {

    const { temperature, dew_point } = this.elements
    let linkedElement = ''
    let value = ''

    if (element.checked) value += '-'

    switch (element.name) {
      case 'temperature_minus': linkedElement = temperature; break
      case 'dew_point_minus': linkedElement = dew_point; break
      default: throw TypeError(`unknown element name`)
    }

    value += linkedElement.value.replace(/\D/, '')
    if (!isNaN(value)) linkedElement.value = value

  }

  form.addHandler('temperature', {
    element: 'temperature_minus',
    auxiliary: auxiliaryTemperatureMinus,
    update: updateTemperature,
  })

  form.addHandler('temperature', {
    element: 'dew_point_minus',
    auxiliary: auxiliaryTemperatureMinus,
    update: updateTemperature,
  })

}
