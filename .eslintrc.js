module.exports = {
  env: {
    browser: true,
    es6: true,
    "plugins": ["fsd"]
  },
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module'
  },
  rules: {
    "fsd/hof-name-prefix": "error",
    "fsd/no-heavy-constructor": "error",
    "fsd/jq-cache-dom-elements": "error",
    "fsd/jq-use-js-prefix-in-selector": "error",
    "fsd/no-function-declaration-in-event-listener": "error",
    "fsd/split-conditionals": "error"
  }
}
