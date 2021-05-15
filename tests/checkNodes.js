'use strict'

require('colors')
const assert = require('assert')
const crypto = require('crypto')
const data = require('../ninjacoin-nodes.json')
const describe = require('mocha').describe
const format = require('util').format
const it = require('mocha').it
const request = require('request-promise-native')
var masterBranchData

function sha256 (msg) {
  if (typeof msg !== 'string') msg = JSON.stringify(msg)
  return crypto.createHmac('sha256', msg).digest('hex')
}

function checkTestNode (node) {
  if (masterBranchData) {
    const check = (masterBranchData.indexOf(sha256(node)) === -1)

    return Promise.resolve(check)
  }

  return request({ url: 'https://raw.githubusercontent.com/ninjacoin-master/ninjacoin-nodes-json/master/ninjacoin-nodes.json', json: true })
    .then(data => {
      data = data.nodes.map(x => sha256(x))

      masterBranchData = data

      return data
    })
    .then(nodes => {
      const check = (nodes.indexOf(sha256(node)) === -1)
      return Promise.resolve(check)
    })
}

describe('Basic Node Check', function () {
  data.nodes.forEach(node => {
    return it(format('%s => %s:%s', node.name, node.url, node.port), function () {
      this.timeout(5000)
      return checkTestNode(node)
        .then(check => {
          if (check) {
            return request({ url: format('%s://%s:%s/info', (node.ssl) ? 'https' : 'http', node.url, node.port), json: true, timeout: 4000 })
          } else {
            return this.skip()
          }
        })
        .then(response => {
          assert(response.version)
        })
        .catch(error => {
          if (error.message && error.message === 'sync skip') return Promise.resolve()
          return Promise.reject(new Error('Could not communicate with node'.red))
        })
    })
  })
})
