
// file: src/components/metar/visibility_vertical.mjs


function updateVisibility() {

  const visibility = this.elements.visibility_vertical.value

  if (visibility === '') {
    return ''
  }

  if (visibility.startsWith('/') && visibility !== '///') {
    return ''
  }

  return 'VV' + visibility.padStart(3, '0')
}

export default function(form) {

  form.addHandler('visibility_vertical', {

    format: (value) => {

      value = value.trim()

      if (value.startsWith('/')) {
        return value.replace(/[^/]/g, '').substring(0, 3)
      }

      if (/^\d/.test(value)) {
        return value.replace(/\D/g, '').substring(0, 2)
      }

      return value
    },

    auxiliary(value) {
      const visibility_range = this.elements.visibility_vertical_range

      if (value === '') {
        visibility_range.value = -1
      }

      else if (value === '///') {
        visibility_range.value = 0
      }

      else if (value.startsWith('/')) {
        visibility_range.value = -1
      }

      else {
        visibility_range.value = value.toString()
      }
    },

    update: updateVisibility,

  })

  form.addHandler('visibility_vertical', {

    element: 'visibility_vertical_range',

    init(elements) {
      const element = elements[0]
      element.setAttribute('min', -1)
      element.setAttribute('max', 20)
      element.setAttribute('step', 1)
      element.value = -1
    },

    auxiliary(value) {
      value = +value
      const visibility = this.elements.visibility_vertical
      if (value === -1) {
        visibility.value = ''
      } else if (value === 0) {
        visibility.value = '///'
      } else {
        visibility.value = value
      }
    },

    update: updateVisibility,

  })

}
