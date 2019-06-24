// eslint-disable-next-line @typescript-eslint/no-var-requires
const poiBabelConfig = require('poi/babel')

const { presets, plugins } = poiBabelConfig(null, {
  jsx: 'preact',
  typescript: true
})
module.exports = {
  presets: presets,
  plugins: plugins,
  env: {
    test: {
      presets: presets
    }
  }
}
