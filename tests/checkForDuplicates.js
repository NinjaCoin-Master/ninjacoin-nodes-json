'use strict'

const assert = require('assert')
const data = require('../ninjacoin-nodes.json')

var seenNodes = []

for (var i = 0; i < data.nodes.length; i++) {
  var node = data.nodes[i]
  console.log(node.name)
  assert(seenNodes.indexOf(node.name) === -1)
  seenNodes.push(node.name)
}
