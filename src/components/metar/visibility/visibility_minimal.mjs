
// file: src/components/metar/visibility/minimal_visibility.mjs


// @todo visibility_minimal_direction

const visibilities = [-1]

for (let i = 0;    i < 800;   i += 50)   visibilities.push(i)
for (let i = 800;  i < 5000;  i += 100)  visibilities.push(i)
for (let i = 5000; i < 10000; i += 1000) visibilities.push(i)
                                         visibilities.push(9999)

const getBase = (value) => value < 800  ? 50
                         : value < 5000 ? 100
                         : value < 9999 ? 1000
                         :                0

function updateVisibility() {
  const visibility = this.elements.visibility.value
  const minimal = this.elements.visibility_minimal.value
  const direction = this.elements.visibility_minimal_direction.value

  return (minimal === '' || Number(minimal) >= Number(visibility))
    ? ''
    : (minimal.padStart(4, '0') + direction)
}

export default function(form) {

  form.addHandler('visibility_minimal', {

    format: (value) => value.trim()
                            .replace(/\D/, '')
                            .substring(0, 4),

    auxiliary(value) {
      const visibility_range = this.elements.visibility_minimal_range

      if (value === '') visibility_range.value = -1

      const visibilityValue = Number(value)
      const base = getBase(visibilityValue)
      let visibilityRangeValue = visibilities.at(-1)

      if (base > 0) {
        const roundedValue = Math.floor(visibilityValue / base) * base
        visibilityRangeValue = visibilities.indexOf(roundedValue)
      }

      visibility_range.value = visibilityRangeValue.toString()
    },

    update: updateVisibility,

  })

  form.addHandler('visibility_minimal', {

    element: 'visibility_minimal_range',

    init(elements) {
      const element = elements[0]
      element.setAttribute('min', 0)
      element.setAttribute('max', visibilities.length - 1)
      element.value = visibilities[0]
    },

    auxiliary(value) {
      value = +value
      const visibility = this.elements.visibility_minimal
      visibility.value = value === 0 ? '' : visibilities[value]
    },

    update: updateVisibility,

  })

  form.addHandler('visibility_minimal', {
    element: 'visibility_minimal_direction',
    update: updateVisibility,
  })

}
