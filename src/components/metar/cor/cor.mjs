
// file: src/components/metar/cor/cor.mjs

function update(value, element) {
  return element.checked ? value : ''
}

export default function(form) {

  form.addHandler('cor', {
    update,
  })

}
