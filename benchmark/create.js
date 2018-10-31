
/**
 * Module dependencies.
 */

var benchmark = require('benchmark')
var benchmarks = require('beautify-benchmark')
var Tokens = require('..')

/**
 * Globals for benchmark.js
 */

global.tokens = new Tokens()
global.secret = global.tokens.secretSync()

var suite = new benchmark.Suite()

suite.add({
  name: 'create',
  minSamples: 100,
  fn: 'var token = tokens.create(secret)'
})

suite.on('start', function onCycle (event) {
  process.stdout.write('  create\n\n')
})

suite.on('cycle', function onCycle (event) {
  benchmarks.add(event.target)
})

suite.on('complete', function onComplete () {
  benchmarks.log()
})

suite.run({ async: false })
