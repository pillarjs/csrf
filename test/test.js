var assert = require('assert')
var crypto = require('crypto')
var csrf = require('..')

describe('CSRF Tokens', function () {
  var secret
  var tokens = csrf()

  describe('.secret()', function () {
    it('should return a string', function () {
      secret = tokens.secretSync()
      assert.equal('string', typeof secret)

      return tokens.secret().then(function (secret) {
        assert.equal('string', typeof secret)
      })
    })

    it('should create a secret asynchronously', function (done) {
      tokens.secret(function (err, secret) {
        assert.ifError(err)
        assert.equal('string', typeof secret)
        done()
      })
    })
  })

  describe('.create()', function () {
    it('should create a token synchronously', function () {
      var token = tokens.create(secret)
      assert.equal('string', typeof token)
      assert(~token.indexOf('-'))
    })

    it('should not contain /, +, or =', function () {
      for (var i = 0; i < 1000; i++) {
        var token = tokens.create(secret)
        assert(!~token.indexOf('/'))
        assert(!~token.indexOf('+'))
        assert(!~token.indexOf('='))
      }
    })

    describe('when crypto.DEFAULT_ENCODING altered', function () {
      var defaultEncoding

      before(function () {
        defaultEncoding = crypto.DEFAULT_ENCODING
        crypto.DEFAULT_ENCODING = 'hex'
      })

      after(function () {
        crypto.DEFAULT_ENCODING = defaultEncoding
      })

      it('should creaate a token', function () {
        var token = tokens.create(secret)
        assert.equal('string', typeof token)
        assert(~token.indexOf('-'))
      })
    })
  })

  describe('.verify()', function () {
    it('should return `true` with valid tokens', function () {
      var token = tokens.create(secret)
      assert(tokens.verify(secret, token))
    })

    it('should return `false` with invalid tokens', function () {
      var token = tokens.create(secret)
      assert(!tokens.verify(tokens.secretSync(), token))
      assert(!tokens.verify('asdfasdfasdf', token))
    })

    it('should return `false` with invalid secret', function () {
      assert(!tokens.verify())
      assert(!tokens.verify([]))
    })

    it('should return `false` with invalid tokens', function () {
      assert(!tokens.verify(secret, undefined))
      assert(!tokens.verify(secret, []))
      assert(!tokens.verify(secret, 'hi'))
    })
  })

  describe('with "saltLength" option', function () {
    it('should reject non-numbers', function () {
      assert.throws(csrf.bind(null, {saltLength: 'bogus'}),
        /option saltLength/)
    })

    it('should reject NaN', function () {
      assert.throws(csrf.bind(null, {saltLength: NaN}),
        /option saltLength/)
    })

    it('should reject Infinity', function () {
      assert.throws(csrf.bind(null, {saltLength: Infinity}),
        /option saltLength/)
    })
  })

  describe('with "secretLength" option', function () {
    it('should reject non-numbers', function () {
      assert.throws(csrf.bind(null, {secretLength: 'bogus'}),
        /option secretLength/)
    })

    it('should reject NaN', function () {
      assert.throws(csrf.bind(null, {secretLength: NaN}),
        /option secretLength/)
    })

    it('should reject Infinity', function () {
      assert.throws(csrf.bind(null, {secretLength: Infinity}),
        /option secretLength/)
    })

    it('should generate secret with specified byte length', function () {
      // 3 bytes = 4 base-64 characters
      // 4 bytes = 6 base-64 characters
      assert.equal(csrf({secretLength: 3}).secretSync().length, 4)
      assert.equal(csrf({secretLength: 4}).secretSync().length, 6)
    })
  })
})
