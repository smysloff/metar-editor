
// file: src/app/main/main.mjs


// type: 'SA_SEND' - METAR, 'SP_SEND' - SPECI
async function sendMetar(type, msgTxt) {

  const endpoint = 'handler.php'

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded: charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: new URLSearchParams({ type, msgTxt }).toString(),
  }

  const response = await fetch(endpoint, options)

  if (!response.ok) {
    return {
      error: true,
      text: `Ошибка: ${response.status}`,
    }
  }

  const text = await response.text()
  if (text !== 'ok') {
    return {
      error: true,
      text: `Ошибка: ${text}`,
    }
  }

  return {
    error: false,
    text: `METAR выпущен успешно`
  }
}


export default function(form) {

  const { output } = form
  const { send, submit, reset } = form.forms.output.elements
  const display = form.forms.output.querySelector('#amtk_wre_metar_display')
  const send_wrapper = send.parentElement
  const submit_wrapper = submit.parentElement
  const display_wrapper = display.parentElement
  const close_btn = display_wrapper.querySelector('input')

  send_wrapper.wre_hidden = false
  submit_wrapper.wre_hidden = true

  send.addEventListener('click', (e) => {
    e.preventDefault()
    send_wrapper.classList.add('wre_hidden')
    submit_wrapper.classList.remove('wre_hidden')
  })

  reset.addEventListener('click', (e) => {
    e.preventDefault()
    send_wrapper.classList.remove('wre_hidden')
    submit_wrapper.classList.add('wre_hidden')
  })


  close_btn.addEventListener('click', e => {
    display_wrapper.classList.add('wre_hidden')
    submit_wrapper.classList.add('wre_hidden')
    send_wrapper.classList.remove('wre_hidden')
  })

  form.forms.output.addEventListener('submit', async (e) => {

    e.preventDefault()

    const msgTxt = form.forms.output.elements.output.value
    const type = msgTxt.includes('METAR') ? 'SA_SEND' : 'SP_SEND'
    const response = await sendMetar(type, msgTxt)

    display.style.color = response.error ? 'red' : 'green'
    display.textContent = response.text
    display_wrapper.classList.remove('wre_hidden')
    submit_wrapper.classList.add('wre_hidden')

  })

}
