
// file: src/components/form_datetime.mjs

function datetime_update() {
  const { date, time } = this.elements
  const date_value = date.value?.split('-')?.at(-1)
  const time_value = time.value?.split(':')?.join('')
  return date_value && time_value
    ? `${date_value}${time_value}Z`
    : ''
}

function setCurrentDatetime() {
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
    update: datetime_update,
  })

  form.addHandler('datetime', {
    element: 'time',
    update: datetime_update,
  })

  form.addHandler('datetime', {
    element: 'current',
    auxiliary: setCurrentDatetime,
    update: datetime_update,
  })

}
