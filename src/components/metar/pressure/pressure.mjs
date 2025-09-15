
// file: components/metar/pressure/pressure.mjs

// @todo
//function auxiliary(value, element) {
//
//  const { pressure, pressure_range: range } = this.elements
//
//  switch (element) {
//
//    case pressure:
//      range.value = pressure.value
//      break
//
//    case range:
//      pressure.value = range.value
//      break
//  }
//
//}

function update(value, element) {
  const result = value < 900 || value > 1100 ? '' : value
  return result === '' ? '' : `Q${result}`
}

export default function(form) {

  form.addHandler('pressure', {

    format(value) {
      const result = value.trim()
                          .replace(/\D/, '')
                          .substring(0, 4)

      if (result === '')
        return ''

      return Number(result) > 1100 ? 1100 : result
    },

    auxiliary(value) {

      const { pressure_range: range } = this.elements

      range.value = value === '' || Number(value) < 500
        ? 499
        : value
    },

    update,

  })

  form.addHandler('pressure', {

    element: 'pressure_range',

    auxiliary(value) {
      const { pressure } = this.elements
      pressure.value = Number(value) === 499 ? '' : value
    },

    update,

  })

}
