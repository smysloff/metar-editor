
// file: src/components/metar/main/main.mjs

export default function(form) {

  console.log(form)

  form.forms.output.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log(e.type)
  })

}
