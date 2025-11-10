
// file: src/core/utils.mjs

import default_icaos from './icaos.mjs'

export function disableCheckbox(name, cleanResult = false) {
  this.elements[name].checked = false
  if (cleanResult) {
    this.result.set(name, '')
  }
}


export function getFirFromPage() {
  const element = document.querySelector('login')
  const fir = element?.dataset?.firIndex?.trim().toUpperCase()
  return isValidFir(fir) ? fir : 'XXXX'
}

export function isValidFir(fir) {
  return fir
      && typeof fir === 'string'
      && fir.length === 4
      && /^[A-Z]{4}$/.test(fir)
}

export async function getIcaosFromDB(fir) {

  if (!isValidFir(fir)) {
    return []
  }

  const endpoint = '/sigmet/modules/taceditor/'

  try {

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ fir }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${ response.status }: ${ response.statusText }`)
    }

    const data = await response.json()

    if (data && Array.isArray(data.aerodromes)) {
      return data.aerodromes
    } else {
      console.warn('Unexpected response structure:', data)
      return []
    }

  } catch (error) {
    console.warn('Failed to fetch ICAOs for FIR', fir, ':', error)
    return []
  }

}

export async function getIcaos(value) {

  const fir = getFirFromPage()

  if (fir === 'XXXX' && value.length === 0) {
    return []
  }

  try {
    const db_icaos = await getIcaosFromDB(fir)
    return db_icaos.length > 0 ? db_icaos : default_icaos
  } catch (error) {
    console.error('Error getting ICAOs:', error)
    return default_icaos
  }
}
