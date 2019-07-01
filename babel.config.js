const presets = [
  [
    '@babel/preset-env',
    { targets: { node: 'current' }, useBuiltIns: 'usage', corejs: 3 }
  ],
  ['@babel/preset-react', { pragma: 'h', pragmaFrag: 'Fragment' }],
  ['@babel/preset-typescript', { jsxPragma: 'h' }]
]
module.exports = {
  presets: presets,
  env: {
    test: {
      presets: presets
    }
  }
}
