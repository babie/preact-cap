const presets = [
  [
    '@babel/preset-env',
    { targets: { node: 'current' }, useBuiltIns: 'usage', corejs: 3 }
  ],
  ['@babel/preset-react', { pragma: 'h', pragmaFrag: 'Fragment' }],
  ['@babel/preset-typescript', { jsxPragma: 'h' }],
  'power-assert'
]
const plugins = []

module.exports = {
  presets: presets,
  plugins: plugins,
  env: {
    test: {
      presets: presets,
      plugins: plugins
    }
  }
}
