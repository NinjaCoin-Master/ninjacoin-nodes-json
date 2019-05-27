'use strict'

const assert = require('assert')
const data = require('../ninjacoin-nodes.json')

for (var i = 0; i < data.nodes.length; i++) {
  var node = data.nodes[i]
  console.log(node.name)
  assert(/^.{0}[a-zA-Z0-9]/.test(node.name))
}
