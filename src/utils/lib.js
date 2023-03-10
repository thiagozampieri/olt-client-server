const moment = require('moment-timezone')

const dummy2json = (chunk, columns, skipLine = 3, delimiter = '_', delimiterHeader = '-') => {
  const header = []
  const data = []

  const lines = chunk.split(/\n/)
  for (const [numOfLine, line] of lines.entries()) {
    if (line.trim().split('').every(char => char === delimiterHeader)) continue
    const element = {}
    for (const [col, position] of columns.entries()) {
      const [start, end] = position
      const value = line.substring(start, end).trim()
      if (!header[col]) header[col] = []
      const name = header[col].join(delimiter).trim()
      if (numOfLine > skipLine) {
        element[text2label(name)] = value.trim()
        continue
      }
      if (value.trim() !== '') header[col].push(value)
    }
    if (JSON.stringify(element) !== '{}') data.push(element)
  }
  return data
}

const text2label = (name) => {
  const text = (name === name.toUpperCase()) ? 
    name.toLowerCase() :
    name
  return text
  .trim()
  .replace(/[ , \/]/gi, '')
  .replace(/\.?([A-Z])/g, (x,y) => '_' + y.toLowerCase())
  .replace(/^_/, '')  
}

const column2json = (array, delimiter = ':') => {
  return array.map(item => {
    const [name, value] = item.trim().split(delimiter)   
    return { [text2label(name)]: (value || '-').trim() }
  }).reduce((map, item) => ({
    ...map,
    ...item
  }), {})
}

const text2table = (array, posnrOriginal, delimiter = '\n') => {
  const regex = /(.)*------(.)*---------\n/g
  const found = [...array].splice(posnrOriginal).join(delimiter)
  const matches = found.matchAll(regex)
  const list = Array.from(matches, m => m.index)
  const [_0, _1, posnr] = list
  const data = [...array].splice(posnrOriginal).join(delimiter).substring(0, posnr)

  return {
    posnr,
    data
  }
}

const day2time = (period) => {
  return period && moment().subtract((period || '').split('-')[0], 'days').startOf((period || '').split('-')[1]).toISOString();
}

module.exports = { 
  dummy2json,
  column2json,
  text2table,
  day2time,
}