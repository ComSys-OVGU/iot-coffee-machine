const parse = require('csv-parse')
const fs = require('await-fs')

const decodeLCD = require('./decode-lcd')
const decodePB = require('./decode-pb')

const MISO_COL = 2
const MOSI_COL = 3

const inFile = process.argv[2] || (console.log('input file required'), process.exit(1))
const outFile = `${inFile.slice(0, -4)}.txt`

function extract ([x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, ...rest], acc = []) {
  const rows = [x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10]
  const obj = {
    miso: '',
    mosi: ''
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    obj.miso += row[MISO_COL].substring(2)
    obj.mosi += row[MOSI_COL].substring(2)
  }

    // after both miso and mosi have been extracted, parse the information
  obj.lcd = decodeLCD(obj.miso)
  obj.pb = decodePB(obj.mosi)

  const ret = [...acc, obj]
  if (rest.length >= 9) {
    return extract(rest, ret)
  } else {
    return ret
  }
}

(async function run () {
  const csv = await fs.readFile(inFile, 'utf8')
  parse(csv, {}, function (err, [_, ...output]) {
    const extracted = extract(output)

    const nice = extracted.map(({
            miso,
            mosi,
            lcd: {
                displayBits: displayMiso = miso,
                time = '',
                events = []
            } = {},
            pb: {
                displayBits: displayMosi = mosi,
                status = '',
                mg = ''
            } = {}
        }) => `${miso} (${displayMiso})\t${mosi} (${displayMosi}) |\t@${time}: ${events.join(',')}\tstatus:${status},mg:${mg}`)

    fs.writeFile(outFile, nice.join('\n'))
  })
})()
