
// file: src/components/metar_cavok.mjs

export default function(form) {

  form.addHandler('cavok', {

    element: 'cavok',

    auxiliary(value, element) {

      const { result } = this
      const { visibility, visibility_range } = this.elements
      const { weather, intensity, precipitation, phenomena } = this.elements
      const { clouds_1_coverage, clouds_1, clouds_1_type, clouds_1_height } = this.elements
      const { clouds_2_coverage, clouds_2, clouds_2_type, clouds_2_height } = this.elements
      const { clouds_3_coverage, clouds_3, clouds_3_type, clouds_3_height } = this.elements
      const { clouds_4_coverage, clouds_4, clouds_4_type, clouds_4_height } = this.elements

      if (element.checked) {
        visibility.value = ''
        visibility_range.value = -1
        weather.value = ''
        intensity.forEach(item => item.checked = false)
        precipitation.value = ''
        phenomena.value = ''
        clouds_1_coverage.value = 'NCD'
        clouds_1.value = ''
        clouds_1_type.forEach(type => type.checked = false)
        clouds_1_height.value = -1
        clouds_2_coverage.value = 'NCD'
        clouds_2.value = ''
        clouds_2_type.forEach(type => type.checked = false)
        clouds_2_height.value = -1
        clouds_3_coverage.value = 'NCD'
        clouds_3.value = ''
        clouds_3_type.forEach(type => type.checked = false)
        clouds_3_height.value = -1
        clouds_4_coverage.value = 'NCD'
        clouds_4.value = ''
        clouds_4_type.forEach(type => type.checked = false)
        clouds_4_height.value = -1
        visibility.disabled = true
        visibility_range.disabled = true
        weather.disabled = true
        intensity.forEach(item => item.disabled = true)
        precipitation.disabled = true
        phenomena.disabled = true
        clouds_1_coverage.disabled = true
        clouds_1.disabled = true
        clouds_1_type.forEach(type => type.disabled = true)
        clouds_1_height.disabled = true
        clouds_2_coverage.disabled = true
        clouds_2.disabled = true
        clouds_2_type.forEach(type => type.disabled = true)
        clouds_2_height.disabled = true
        clouds_3_coverage.disabled = true
        clouds_3.disabled = true
        clouds_3_type.forEach(type => type.disabled = true)
        clouds_3_height.disabled = true
        clouds_4_coverage.disabled = true
        clouds_4.disabled = true
        clouds_4_type.forEach(type => type.disabled = true)
        clouds_4_height.disabled = true
        result.set('visibility', '')
        result.set('weather', '')
        result.set('clouds_1', '')
        result.set('clouds_2', '')
        result.set('clouds_3', '')
        result.set('clouds_4', '')
      } else {
        visibility.disabled = false
        visibility_range.disabled = false
        weather.disabled = false
        intensity.forEach(item => item.disabled = false)
        precipitation.disabled = false
        phenomena.disabled = false
        clouds_1_coverage.disabled = false
        clouds_1.disabled = false
        clouds_1_type.forEach(type => type.disabled = false)
        clouds_1_height.disabled = false
        clouds_2_coverage.disabled = false
        clouds_2.disabled = false
        clouds_2_type.forEach(type => type.disabled = false)
        clouds_2_height.disabled = false
        clouds_3_coverage.disabled = false
        clouds_3.disabled = false
        clouds_3_type.forEach(type => type.disabled = false)
        clouds_3_height.disabled = false
        clouds_4_coverage.disabled = false
        clouds_4.disabled = false
        clouds_4_type.forEach(type => type.disabled = false)
        clouds_4_height.disabled = false
      }
    },

    update(value, element) {
      return element.checked ? element.value : ''
    },

  })

}
