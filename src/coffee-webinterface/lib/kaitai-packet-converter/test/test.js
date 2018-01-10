const yaml = require('js-yaml')
const fs = require('fs')

const { resolveTypes } = require('../')

const KSY_V1 = yaml.safeLoad(fs.readFileSync('./delonghi_v1.ksy', 'utf8'))
const types = KSY_V1.types

// console.log(JSON.stringify(types, null, 4))
console.log(JSON.stringify(resolveTypes(types), null, 4))
