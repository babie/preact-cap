const presets = [
  [
    '@babel/preset-env',
    { targets: { node: 'current' }, useBuiltIns: 'usage', corejs: 3 }
  ],
  ['@babel/preset-typescript', { jsxPragma: 'h' }],
  ['@babel/preset-react', { pragma: 'h', pragmaFrag: 'Fragment' }]
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
