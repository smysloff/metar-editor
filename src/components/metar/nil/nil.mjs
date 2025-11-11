
// file: src/components/metar/nil/nil.mjs

import { disableCheckbox } from '../../../core/utils.mjs'

function auxiliary(value, element) {
  if (element.checked) {
    disableCheckbox.call(this, 'cor', true)
    disableCheckbox.call(this, 'auto', true)
  }
}

function update(value) {
  const { nil } = this.elements
  return nil.checked ? value : ''
}


export default function(form) {
  form.addHandler('nil', {
    auxiliary,
    update,
  })
}
