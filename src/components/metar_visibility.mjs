
// file: src/components/metar_visibility.mjs

function updateVisibility() {
  const { visibility } = this.elements
  const { value } = visibility
  return value === '' ? '' : value.padStart(4, '0')
}

export default function(form) {

  form.addHandler('visibility', {

    format: (value) => value
                         .trim()
                         .replace(/\D/, '')
                         .substring(0, 4),

    auxiliary(value) {
      const { visibility_range } = this.elements

      if (value === '') visibility_range.value = -1

      const visibilityValue = +value

      const base = visibilityValue < 800  ? 50
                 : visibilityValue < 5000 ? 100
                 : visibilityValue < 9999 ? 1000
                 : 0

      let visibilityRangeValue = AMTK_VISIBILITY.at(-1)

      if (base > 0) {
        const roundedValue = Math.floor(visibilityValue / base) * base
        visibilityRangeValue = AMTK_VISIBILITY.indexOf(roundedValue)
      }

      visibility_range.value = visibilityRangeValue.toString()
    },

    update: updateVisibility,

  })

  form.addHandler('visibility', {

    element: 'visibility_range',

    init(elements) {
      const element = elements[0]
      element.setAttribute('min', 0)
      element.setAttribute('max', AMTK_VISIBILITY.length - 1)
      element.value = AMTK_VISIBILITY[0]
    },

    auxiliary(value) {
      value = +value
      const { visibility } = this.elements
      visibility.value = value === 0 ? '' : AMTK_VISIBILITY[value]
    },

    update: updateVisibility,

  })

}
