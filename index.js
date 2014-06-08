
var crypto = require('crypto')
var rndm = require('rndm')
var scmp = require('scmp')
var uid = require('uid2')

module.exports = function (options) {
  options = options || {}

  // adjustable lengths
  var secretLength = options.secretLength || 24 // the longer the better
  var saltLength = options.saltLength || 8 // doesn't need to be long

  // convert a secret + a salt to a token
  // this does NOT have to be cryptographically secure, so we don't use HMAC,
  // and we use sha1 because sha256 is unnecessarily long for cookies and stuff
  var tokensize = options.tokenize || function tokenize(secret, salt) {
    return salt + '-'
      + crypto
        .createHash('sha1')
        .update(salt)
        .update('-')
        .update(secret)
        .digest('base64')
  }

  // create a secret key
  // this __should__ be cryptographically secure,
  // but generally client's can't/shouldn't-be-able-to access this so it really doesn't matter.
  // to do: async version
  function secret(cb) {
    return uid(secretLength, cb)
  }

  // create a csrf token
  function create(secret) {
    return tokensize(secret, rndm(saltLength))
  }

  // verify whether a token is valid
  function verify(secret, token) {
    if (!token || typeof token !== 'string') return false
    var expected = tokensize(secret, token.split('-')[0])
    return scmp(token, expected)
  }

  return {
    secret: secret,
    create: create,
    verify: verify,
  }
}
