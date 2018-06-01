module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: 'standard',
  globals: {
    __static: true
  },
  plugins: [
    'html'
  ],
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "no-undef": "off",
    'semi':0,
    'camelcase': 0,
    'indent':0,
    'no-tabs':0,
    'no-mixed-spaces-and-tabs':0,
    'space-before-function-paren':0,
    'brace-style':0,
    'no-new': 0,
    'new-cap': 0,
    "no-sequences": 0,
    "no-unused-expressions": 0,
    "one-var":0,
    "no-return-assign": 0,
    "no-mixed-operators": 0,
    "no-use-before-define": 0,
    "no-proto": 0,
    "no-redeclare": 0,
    "no-cond-assign": 0,
    "eqeqeq": 0,
    "no-useless-escape": 0,
    "no-useless-call": 0
  }
}
