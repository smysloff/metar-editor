
// file: src/components/metar/clouds/clouds.mjs


function formatClouds(value) {
  const val = value.trim()
  if (val === '') return ''
  const result = val.substr(0, 3)
                    .replace(/\D/, '')
  return Number(result) > 120 ? 120 : result 
}

function updateClouds(_, element) {

  let height, coverage, types

  const { clouds_1, clouds_1_coverage, clouds_1_height, clouds_1_type } = this.elements
  const { clouds_2, clouds_2_coverage, clouds_2_height, clouds_2_type } = this.elements
  const { clouds_3, clouds_3_coverage, clouds_3_height, clouds_3_type } = this.elements
  const { clouds_4, clouds_4_coverage, clouds_4_height, clouds_4_type } = this.elements

  if (
    clouds_1 === element
    || clouds_1_coverage === element
    || clouds_1_height === element
    || Array.from(clouds_1_type).includes(element)
  ) {
    height = clouds_1.value.trim()
    coverage = clouds_1_coverage.value
    types = clouds_1_type
  }

  else if (
    clouds_2 === element
    || clouds_2_coverage === element
    || clouds_2_height === element
    || Array.from(clouds_2_type).includes(element)
  ) {
    height = clouds_2.value.trim()
    coverage = clouds_2_coverage.value
    types = clouds_2_type
  }


  else if (
    clouds_3 === element
    || clouds_3_coverage === element
    || clouds_3_height === element
    || Array.from(clouds_3_type).includes(element)
  ) {
    height = clouds_3.value.trim()
    coverage = clouds_3_coverage.value
    types = clouds_3_type
  }

  else if (
    clouds_4 === element
    || clouds_4_coverage === element
    || clouds_4_height === element
    || Array.from(clouds_4_type).includes(element)
  ) {
    height = clouds_4.value.trim()
    coverage = clouds_4_coverage.value
    types = clouds_4_type
  }

  else
    throw new TypeError(`Unable to find the required cloud layer`)

  if (height === '') return ''

  let result = ''
  result += coverage
  result += height.padStart(3, '0')

  for (const type of types) {
    if (type.checked) {
      result += type.value
    }
  }

  return result
}

function auxiliaryClouds1(value) {
  const { clouds_1_height: height } = this.elements
  height.value = value === '' ? -1 : +value 
}

function auxiliaryClouds1Height(value) {
  const { clouds_1 } = this.elements
  clouds_1.value = +value === -1 ? '' : value
}

function auxiliaryClouds1Coverage(value) {
  const {
    clouds_1: height,
    clouds_1_height: range,
    clouds_1_type: types,
  } = this.elements
  if (value === 'NCD') {
    height.value = ''
    range.value = -1
    types.forEach((type) => type.checked = false)
  }
}

function auxiliaryClouds1Type(value, element) {
  const { clouds_1_type: types } = this.elements
  for (const type of types) {
     if (type !== element) {
       type.checked = false
     }
   }
}

form.addHandler('clouds_1', {
  element: 'clouds_1',
  format: formatClouds,
  auxiliary: auxiliaryClouds1,
  update: updateClouds,
})

form.addHandler('clouds_1', {
  element: 'clouds_1_height',
  auxiliary: auxiliaryClouds1Height,
  update: updateClouds,
})

form.addHandler('clouds_1', {
  element: 'clouds_1_coverage',
  auxiliary: auxiliaryClouds1Coverage,
  update: updateClouds,
})

form.addHandler('clouds_1', {
  element: 'clouds_1_type',
  auxiliary: auxiliaryClouds1Type,
  update: updateClouds,
})

function updateClouds2() {
  let {
    clouds_2: height,
    clouds_2_coverage: coverage,
    clouds_2_type: types,
  } = this.elements
  height = height.value.trim()
  coverage = coverage.value
  if (height === '' || coverage === 'NCD') return ''
  let result = ''
  result += coverage
  result += height.padStart(3, '0')
  for (const type of types) {
    if (type.checked) {
      result += type.value
    }
  }
  return result
}

function auxiliaryClouds2(value) {
  const { clouds_2_height: height } = this.elements
  height.value = value === '' ? -1 : +value 
}

function auxiliaryClouds2Height(value) {
  const { clouds_2 } = this.elements
  clouds_2.value = +value === -1 ? '' : value
}

function auxiliaryClouds2Coverage(value) {
  const {
    clouds_2: height,
    clouds_2_height: range,
    clouds_2_type: types,
  } = this.elements
  if (value === 'NCD') {
    height.value = ''
    range.value = -1
    types.forEach((type) => type.checked = false)
  }
}

function auxiliaryClouds2Type(value, element) {
  const { clouds_2_type: types } = this.elements
  for (const type of types) {
     if (type !== element) {
       type.checked = false
     }
   }
}

form.addHandler('clouds_2', {
  element: 'clouds_2',
  format: formatClouds,
  auxiliary: auxiliaryClouds2,
  update: updateClouds,
})

form.addHandler('clouds_2', {
  element: 'clouds_2_height',
  auxiliary: auxiliaryClouds2Height,
  update: updateClouds,
})

form.addHandler('clouds_2', {
  element: 'clouds_2_coverage',
  auxiliary: auxiliaryClouds2Coverage,
  update: updateClouds,
})

form.addHandler('clouds_2', {
  element: 'clouds_2_type',
  auxiliary: auxiliaryClouds2Type,
  update: updateClouds,
})

function updateClouds3() {
  let {
    clouds_3: height,
    clouds_3_coverage: coverage,
    clouds_3_type: types,
  } = this.elements
  height = height.value.trim()
  coverage = coverage.value
  if (height === '' || coverage === 'NCD') return ''
  let result = ''
  result += coverage
  result += height.padStart(3, '0')
  for (const type of types) {
    if (type.checked) {
      result += type.value
    }
  }
  return result
}

function auxiliaryClouds3(value) {
  const { clouds_3_height: height } = this.elements
  height.value = value === '' ? -1 : +value 
}

function auxiliaryClouds3Height(value) {
  const { clouds_3 } = this.elements
  clouds_3.value = +value === -1 ? '' : value
}

function auxiliaryClouds3Coverage(value) {
  const {
    clouds_3: height,
    clouds_3_height: range,
    clouds_3_type: types,
  } = this.elements
  if (value === 'NCD') {
    height.value = ''
    range.value = -1
    types.forEach((type) => type.checked = false)
  }
}

function auxiliaryClouds3Type(value, element) {
  const { clouds_3_type: types } = this.elements
  for (const type of types) {
     if (type !== element) {
       type.checked = false
     }
   }
}

form.addHandler('clouds_3', {
  element: 'clouds_3',
  format: formatClouds,
  auxiliary: auxiliaryClouds3,
  update: updateClouds,
})

form.addHandler('clouds_3', {
  element: 'clouds_3_height',
  auxiliary: auxiliaryClouds3Height,
  update: updateClouds,
})

form.addHandler('clouds_3', {
  element: 'clouds_3_coverage',
  auxiliary: auxiliaryClouds3Coverage,
  update: updateClouds,
})

form.addHandler('clouds_3', {
  element: 'clouds_3_type',
  auxiliary: auxiliaryClouds3Type,
  update: updateClouds,
})

function auxiliaryClouds4(value) {
  const { clouds_4_height: height } = this.elements
  height.value = value === '' ? -1 : +value 
}

function auxiliaryClouds4Height(value) {
  const { clouds_4 } = this.elements
  clouds_4.value = +value === -1 ? '' : value
}

function auxiliaryClouds4Coverage(value) {
  const {
    clouds_4: height,
    clouds_4_height: range,
    clouds_4_type: types,
  } = this.elements
  if (value === 'NCD') {
    height.value = ''
    range.value = -1
    types.forEach((type) => type.checked = false)
  }
}

function auxiliaryClouds4Type(value, element) {
  const { clouds_4_type: types } = this.elements
  for (const type of types) {
     if (type !== element) {
       type.checked = false
     }
   }
}

form.addHandler('clouds_4', {
  element: 'clouds_4',
  format: formatClouds,
  auxiliary: auxiliaryClouds4,
  update: updateClouds,
})

form.addHandler('clouds_4', {
  element: 'clouds_4_height',
  auxiliary: auxiliaryClouds4Height,
  update: updateClouds,
})

form.addHandler('clouds_4', {
  element: 'clouds_4_coverage',
  auxiliary: auxiliaryClouds4Coverage,
  update: updateClouds,
})

form.addHandler('clouds_4', {
  element: 'clouds_4_type',
  auxiliary: auxiliaryClouds4Type,
  update: updateClouds,
})
