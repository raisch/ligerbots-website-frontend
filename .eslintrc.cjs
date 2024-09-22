const standard = require('eslint-config-standard')

module.exports = [
  standard,
  {
    env: {
      browser: true,
      es2021: true,
      node: true
    },
    extends: 'standard',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {}
  }
]
