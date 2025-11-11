
// file: components/metar/trend/trend.mjs

export default function(form) {

  form.addHandler('trend', {
    element: 'trend_text',
    format: (value) => value.trim().toUpperCase(),
    update: (value) => value,
  })

}
