const superagent = require('superagent')
const xmlReader = require('xml-reader')

const ADDS_BASE_URI = 'https://www.aviationweather.gov'
const ADDS_API_URI = `${ADDS_BASE_URI}/adds/dataserver_current/httpparam`
const DATA_SOURCES = [
  'metars',
  'tafs',
  'aircraftreports',
  'airsigmets',
  'gairmets',
  'stations'
]

const productTag = dataSource => {
  return {
    tafs: 'TAF',
    metars: 'METAR',
    airsigmets: 'AIRSIGMET',
    aircraftreports: 'AircraftReport',
    gairmets: 'GAIRMET',
    stations: 'Station'
  }[dataSource.toLowerCase()]
}

const tryParseNumber = str => {
  const number = Number(str)
  const float = parseFloat(number)
  if (float === number) {
    return float
  }
  const int = parseInt(number)
  if (int === number) {
    return int
  }
  return str
}

const extractAttributes = field => {
  if (!field.attributes) {
    return
  }
  const keys = Object.keys(field.attributes)
  const attributes = {}
  keys.map(k => {
    attributes[k] = tryParseNumber(field.attributes[k])
  })
  return attributes
}

const extractSingleValue = field => {
  if (Object.keys(field.attributes).length > 0) {
    return {
      value: tryParseNumber(field.children[0].value),
      attributes: extractAttributes(field)
    }
  } else {
    return tryParseNumber(field.children[0].value)
  }
}

const extractData = element => {
  if (!element.children || element.children.length === 0) {
    return null
  }

  const data = { ...extractAttributes(element) }
  element.children.map(field => {
    // If the element has no value, just grab any attributes
    if (field.children.length === 0) {
      if (data[field.name] !== undefined) {
        if (data[field.name].length > 0) {
          data[field.name].push(extractAttributes(field))
        } else {
          data[field.name] = [ data[field.name], extractAttributes(field) ]
        }
      } else {
        data[field.name] = extractAttributes(field)
      }
      return
    }
    // If the element has a value, extract it
    if (field.children.length === 1) {
      data[field.name] = extractSingleValue(field)
      return
    }

    // If element has nested child elements, resursively extract values
    if (field.children.length > 1) {
      if (data[field.name] !== undefined) {
        if (data[field.name].length > 0) {
          data[field.name].push(extractData(field))
        } else {
          data[field.name] = [ data[field.name], extractData(field) ]
        }
      } else {
        data[field.name] = extractData(field)
      }
    }
  })

  return data
}

const fetch = async (options) => {
  try {
    const response = await superagent.get(ADDS_API_URI)
      .query({
        requestType: 'retrieve',
        format: 'xml',
        ...options
      })

    if (!response || !response.ok || !response.text || response.text.match(/<error>/)) {
      throw new Error('Error fetching from ADDS', {
        statusCode: response.statusCode,
        text: response.text
      })
    }

    const product = productTag(options.dataSource)
    const reader = xmlReader.create({ stream: true })
    const results = []
    reader.on(`tag:${product}`, element => {
      results.push(extractData(element))
    })
    await reader.parse(response.text)
    return results
  } catch (error) {
    console.error(error)
  }
}

const ADDS = async (...args) => {
  if (!args) {
    throw new Error('No arguments provided to ADDS()')
  }

  if (args.length === 2 && typeof args[0] === 'string' && typeof args[1] === 'object') {
    const dataSource = args[0]
    const options = args[1]
    if (DATA_SOURCES.includes(dataSource)) {
      return fetch({ dataSource, ...options })
    }
  }

  throw new Error('Invalid arguments provided to ADDS()')
}

module.exports = ADDS
module.exports.ADDS_BASE_URI = ADDS_BASE_URI
module.exports.ADDS_API_URI = ADDS_API_URI
module.exports.DATA_SOURCES = DATA_SOURCES
