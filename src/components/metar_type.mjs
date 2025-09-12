
// file: src/components/metar_type.mjs

function update() {
  let result = ''
  for (const type of this.elements.type) {
    if (type.checked) {
      result += type.value
      break
    }
  }
  const { cor } = this.elements
  result += cor.checked ? ` ${cor.value}` : ''
  return result
}

export default function(form) {

  form.addHandler('type', {
    checked: 'METAR',
    update,
  })

  form.addHandler('type', {
    element: 'cor',
    update,
  })

}
