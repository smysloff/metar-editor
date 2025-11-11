
// file: src/components/metar/weather/weather.mjs


function auxiliaryPhenomena(value) {
  const { weather } = this.elements
  if (value !== '') weather.value += value
}

function updateWeather() {
  const { weather } = this.elements
  const value = weather.value.trim()
  return value.length > 1 ? value : ''
}

export default function(form) {

  form.addHandler('weather', {

    element: 'weather',

    format(value) {
      return value
               .toUpperCase()
               .replace(/[^-+A-Z ]/, '')
    },

    auxiliary(value) {
      const { intensity } = this.elements
      const sign = value[0]
      for (const item of intensity) {
        item.checked = item.value === sign 
      }
    },

    update: updateWeather,

  })

  form.addHandler('weather', {

    element: 'intensity',

    auxiliary(value, element) {

      let sign = ''
      const { intensity, weather } = this.elements

      for (const item of intensity) {
        if (item !== element) item.checked = false
        if (item.checked) sign = item.value
      }

      weather.value = weather.value.replace(/^[+-]/, '')
      if (sign) {
        weather.value = sign + weather.value
      }
    },

    update: updateWeather,

  })

  form.addHandler('weather', {
    element: 'precipitation',
    auxiliary: auxiliaryPhenomena,
    update: updateWeather,
  })

  form.addHandler('weather', {
    element: 'phenomena',
    auxiliary: auxiliaryPhenomena,
    update: updateWeather,
  })

}
