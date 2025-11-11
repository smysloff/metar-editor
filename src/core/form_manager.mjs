
// file: src/core/form_manager.mjs

export default class {

  #non_clickable_types = [
    'text',
    'date',
    'time',
    'radio',
    'checkbox',
  ]

  #handled_events = [
    'click',
    'input',
  ]

  root     = null
  output   = null
  elements = null

  forms = {
    input:  null,
    output: null,
  }

  result   = new Map()
  registry = new Map()

  constructor(selector) {

    this.root = document.querySelector(selector)

    if (!this.root) {
      console.warn(`can't find a form 'root' with selector ${selector}`)
    }

    const forms = Array.from(this.root.children)
                       .filter(child => child.tagName === 'FORM')

    this.forms.input  = forms?.find(form => form.name.match(/input/i))
    this.forms.output = forms?.find(form => form.name.match(/output/i))

    if (!this.forms.input) {
      console.warn(`can't find 'input' form in 'root' element ${selector}`)
    }

    if (!this.forms.output) {
      console.warn(`can't find 'output' form in 'root' element ${ selector }`)
    }

    this.elements = this.forms.input.elements
    this.output   = this.forms.output.elements.output

    this.#handled_events.forEach(handled_event =>
      this.forms.input.addEventListener(
        handled_event, (event) => this.#dispatch(event)))

  }

  #dispatch(event) {

    let element = Array.from(this.elements)
                       .find(element => element === event.target)

    if (!element) {
      if (event.target instanceof HTMLOptionElement) {
        element = event.target.parentElement
      } else {
        return
      }
    }

    if (event.type === 'click') {
      if (
        (element instanceof HTMLInputElement
         && this.#non_clickable_types.includes(element.type))
        || event.target instanceof HTMLSelectElement
      ) {
        return
      }
    }

    const record = this.registry.get(element)
    if (!record) {
      return
    }

    const { name } = record
    const { format, auxiliary, update } = record.callbacks

    if (format) {
      element.value = format.call(this, element.value, element)
    }

    if (auxiliary) {
      auxiliary.call(this, element.value, element)
    }

    if (update) {
      const value = update.call(this, element.value, element)
      this.result.set(name, value)
    }

    this.#update()
  }

  #update() {
    const result = []

    for (const [key, value] of this.result) {
      const item = value.trim()
      if (item !== '') result.push(item)
    }

    const text = result.join(' ')

    this.output instanceof HTMLInputElement
      ? this.output.value = text
      : this.output.textContent = text
  }

  #checkHandlerArguments(groupname, options) {
    if (typeof groupname !== 'string' || groupname === '') {
      throw new TypeError(`AMTK_Form::addHandler must be a non empty string`)
    }
  }

  #createResultToken(name) {
    if (!this.result.has(name)) {
      this.result.set(name, '')
    }
  }

  #getElementsByName(name) {
    return Array.from(this.elements)
                .filter((element) => element.name === name)
  }

  #createRecord(groupname, { format, auxiliary, update }) {
    return {
      name: groupname,
      callbacks: { format, auxiliary, update },
    }
  }

  #writeRecordToRegistry(elements, record) {
    elements.forEach((element) => this.registry.set(element, record))
  }

  #updateResultByValueOf(element) {
    const record = this.registry.get(element)
    this.result.set(record.name, element.value)
  }

  #handleCheckedElements(elements, { checked }) {

    if (!checked) {
      return
    }

    if (typeof checked === 'string') {
      checked = [checked]
    }

    if (!Array.isArray(checked)) {
      throw new TypeError(
        `'checked' must be 'string', 'array of strings' or 'null'`
      )
    }

    for (const value of checked) {

      if (typeof value !== 'string') {
        throw new TypeError(
          `'checked' must be 'string', 'array of strings' or 'null'`
        )
      }

      for (const element of elements) {
        if (
          element instanceof HTMLInputElement
          && ['checkbox', 'radio'].includes(element.type)
        ) {
          if (element.value === value) {
            element.checked = true
            this.#updateResultByValueOf(element)
          }
        }
      }

    }

    this.#update()
  }

  #runInitHandler(elements, { init }) {
    if (init) {
      init.call(this, elements)
      this.#update()
    }
  }

  updateResult() {
    this.#update()
  }

  addHandler(name, options = {}) {

    // token  - specific HTMLInput 'name' attribute
    //          or abstract group of HTMLInput elemments
    // record = { token, callbacks }
    // -------------------------------------------------
    // this.registry = Map(element, record)
    // this.result   = Map(token, value)

    this.#checkHandlerArguments(name, options)

    this.#createResultToken(name)

    const elements = this.#getElementsByName(options.element ?? name)
    const record = this.#createRecord(name, options)

    this.#writeRecordToRegistry(elements, record)

    this.#handleCheckedElements(elements, options)
    this.#runInitHandler(elements, options)
  }

}
