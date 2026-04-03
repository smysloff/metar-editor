
// file: src/components/metar/rmk/rmk.mjs

export default function(form) {
  form.addHandler('rmk', { init, format, update })
}

function init() {
  this.result.set('rmk', '=')
}

function format(value) {
  return value.trim().toUpperCase()
}

function update(value = '') {
  return value + '='
}
