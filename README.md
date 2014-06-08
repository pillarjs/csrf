
# CSRF Tokens

Logic behind CSRF token creation and verification.
Read [Understanding-CSRF](http://www.jongleberry.com/understanding-csrf.html) for more information on CSRF.
Use this module to create custom CSRF middleware and what not.

## API

```js
var csrf = require('csrf-tokens')(options)

var secret = csrf.secret()
var token = csrf.create(secret)
var valid = csrf.verify(secret, token)
```

Options:

- `secretLength: 24` - the byte length of the secret key
- `saltLength: 8` - the string length of the salt
- `tokensize: (secret, salt) => token` - a custom token creation function

### var secret = csrf.secret()

Create a new `secret` of length `secretLength`.
You don't have to use this.

### var token = csrf.token(secret)

Create a CSRF token based on a `secret`.
This is the token you pass to clients.

### var valid = csrf.verify(secret, token)

Check whether a CSRF token is valid based on a `secret`.
If it's not valid, you should probably throw a `403` error.
