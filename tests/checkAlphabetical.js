'use strict'

const assert = require('assert')
const crypto = require('crypto')
const data = require('../ninjacoin-nodes.json')

function sha256 (msg) {
  if (typeof msg !== 'string') msg = JSON.stringify(msg)
  return crypto.createHmac('sha256', msg).digest('hex')
}

const names = []
data.nodes.forEach((node) => {
  names.push(node.name.toLowerCase())
})

const originalHash = sha256(names)
names.sort()
const sortedHash = sha256(names)

console.log('')
console.log('Alphabetically Sorted Order')
console.log('===========================')
names.forEach(name => console.log(name))

assert(originalHash === sortedHash)
