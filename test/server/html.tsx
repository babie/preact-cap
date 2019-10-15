import { render } from 'preact-render-to-string'
import { App } from './App'
import { Cap } from '../../src'

interface Props {
  url: string
}
export const html = ({ url }: Props): string => {
  const rendered = render(App({ url }))
  return `
    <!doctype html>
    <html lang="en">
      <head>${Cap.toString()}</head>
      <body>${rendered}</body>
    </html>
  `.trim()
}
