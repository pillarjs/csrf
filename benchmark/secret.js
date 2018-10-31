
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

var suite = new benchmark.Suite()

suite.add({
  name: 'secretSync',
  minSamples: 100,
  fn: 'var secret = tokens.secretSync()'
})

suite.add({
  name: 'secret - callback',
  minSamples: 100,
  defer: true,
  fn: 'tokens.secret(function (err, secret) { deferred.resolve() })'
})

if (global.Promise) {
  suite.add({
    name: 'secret - promise',
    minSamples: 100,
    defer: true,
    fn: 'tokens.secret().then(function (secret) { deferred.resolve() })'
  })
}

suite.on('start', function onCycle (event) {
  process.stdout.write('  secret\n\n')
})

suite.on('cycle', function onCycle (event) {
  benchmarks.add(event.target)
})

suite.on('complete', function onComplete () {
  benchmarks.log()
})

suite.run({ async: false })
