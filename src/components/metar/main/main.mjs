
// file: src/components/metar/main/main.mjs

export default function(form) {

  const { output } = form
  const { send, submit, reset } = form.forms.output.elements
  const send_wrapper = send.parentElement
  const submit_wrapper = submit.parentElement

  send_wrapper.hidden = false
  submit_wrapper.hidden = true

  send.addEventListener('click', (e) => {
    e.preventDefault()
    send_wrapper.hidden = true
    submit_wrapper.hidden = false
  })

  reset.addEventListener('click', (e) => {
    e.preventDefault()
    send_wrapper.hidden = false
    submit_wrapper.hidden = true
  })

  form.forms.output.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log(e.type)
  })

}
