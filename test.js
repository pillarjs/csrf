
var assert = require('assert')

var csrf = require('./')()

describe('CSRF Tokens', function () {
  var secret

  describe('.secret()', function () {
    it('should return a string', function () {
      secret = csrf.secret()
      assert.equal('string', typeof secret)
    })
  })

  describe('.create()', function () {
    it('should create a token', function () {
      var token = csrf.create(secret)
      assert.equal('string', typeof token)
      assert(~token.indexOf('-'))
    })
  })

  describe('.verify()', function () {
    it('should return `true` with valid tokens', function () {
      var token = csrf.create(secret)
      assert(csrf.verify(secret, token))
    })

    it('should return `false` with invalid tokens', function () {
      var token = csrf.create(secret)
      assert(!csrf.verify(csrf.secret(), token))
      assert(!csrf.verify('asdfasdfasdf', token))
    })
  })
})
