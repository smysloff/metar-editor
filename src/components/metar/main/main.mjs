
// file: src/components/metar/main/main.mjs

export default function(form) {

  const { output } = form
  const { send, submit, reset } = form.forms.output.elements
  const send_wrapper = send.parentElement
  const submit_wrapper = submit.parentElement

  //send_wrapper.hidden = false
  //submit_wrapper.hidden = true

  send.addEventListener('click', (e) => {
    e.preventDefault()
    send_wrapper.classList.add('amtk_hidden')
    submit_wrapper.classList.remove('amtk_hidden')
  })

  reset.addEventListener('click', (e) => {
    e.preventDefault()
    send_wrapper.classList.remove('amtk_hidden')
    submit_wrapper.classList.add('amtk_hidden')
  })

  form.forms.output.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log(e.type)
  })

}
