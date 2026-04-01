
// file: src/components/metar/rmk/rmk.mjs

export default function(form) {

  form.addHandler('rmk', {
    format: (value) => value.trim().toUpperCase(),
    update: (value) => value,
  })

}
