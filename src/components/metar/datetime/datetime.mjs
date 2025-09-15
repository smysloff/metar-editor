
// file: src/components/metar/datetime/datetime.mjs

function update() {
  const { date, time } = this.elements
  const dateval = date.value?.split('-')?.at(-1)
  const timeval = time.value?.split(':')?.join('')
  return dateval && timeval ? `${dateval}${timeval}Z` : ''
}

function auxiliary() {
  const { date, time } = this.elements
  const now = new Date()
  const y = now.getUTCFullYear()
  const m = (now.getUTCMonth() + 1).toString().padStart(2, '0')
  const d = now.getUTCDate().toString().padStart(2, '0')
  const h = now.getUTCHours().toString().padStart(2, '0')
  const i = now.getUTCMinutes().toString().padStart(2, '0')
  date.value = `${y}-${m}-${d}`
  time.value = `${h}:${i}`
}

export default function(form) {

  form.addHandler('datetime', {
    element: 'date',
    update,
  })

  form.addHandler('datetime', {
    element: 'time',
    update,
  })

  form.addHandler('datetime', {
    element: 'current',
    auxiliary,
    update,
  })

}
