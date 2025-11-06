
// file: src/core/utils.mjs

export function disableCheckbox(name, cleanResult = false) {
  this.elements[name].checked = false
  if (cleanResult) {
    this.result.set(name, '')
  }
}
