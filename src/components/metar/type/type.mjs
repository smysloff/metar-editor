
// file: src/components/metar/type/type.mjs

function update() {

  let result = ''

  for (const type of this.elements.type) {
    if (type.checked) {
      result += type.value
      break
    }
  }

  return result
}

export default function(form) {
  form.addHandler('type', {
    checked: 'METAR',
    update,
  })
}
