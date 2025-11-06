
// file: src/components/metar/auto/auto.mjs

import { disableCheckbox } from '../../../core/utils.mjs'

function auxiliary(value, element) {
  if (element.checked) {
    disableCheckbox.call(this, 'nil', true)
  }
}

function update(value) {
  const { auto } = this.elements
  return auto.checked ? value : ''
}

export default function(form) {
  form.addHandler('auto', { auxiliary, update })
}
