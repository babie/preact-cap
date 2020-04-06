# 🧢 preact-cap

&lt;head> updater for [Preact](https://github.com/preactjs/preact).

`<head>`'s `<title>`, `<meta>`, `<base>`, `<link>`, `<style>`, `<script>` tags and `<html>`'s `lang` attributes are supported.

## 🌩 Install

```shell
$ npm install preact-cap
```

or

```shell
$ yarn add preact-cap
```

## 🎸 Usage

`App.tsx`:

```tsx
import { h, Fragment } from 'preact'
import { Router } from 'preact-router'
import { Link } from 'preact-router/match'
import { Cap } from 'preact-cap'

export const Home = () => {
  return (
    <>
      <Cap>
        <title>Home</title>
      </Cap>
      <h1>Welcome</h1>
      <Link href="/about">About</Link>
      <Link href="/ja">Japanese</Link>
    </>
  )
}

export const About = () => {
  return (
    <>
      <Cap>
        <title>About</title>
      </Cap>
      <h1>About</h1>
      <Link href="/">Home</Link>
      <Link href="/ja">Japanese</Link>
    </>
  )
}

export const Japanese = () => {
  return (
    <>
      <Cap lang="ja">
        <title>日本語</title>
      </Cap>
      <h1>日本語</h1>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
    </>
  )
}

export const App = ({ url: string }) => {
  return (
    <Router url={url}>
      <Home path="/" />
      <About path="/about" />
      <Japanese path="/ja" />
    </Router>
  )
}
```

## 🎨 Server-Side Rendering

`index.tsx`:

```tsx
import { hydrate } from 'preact'
import { App } from './App'

const app = document.getElementById('app')
if (app) {
  hydrate(<App url={url} />, app)
}
```

`server.ts`:

```ts
import express from 'express'
import { html } from './html'

const app = express()

app.use(express.static('public'))

app.get('*', (req, res) => {
  const doc = html({ url: req.url })
  res.send(doc)
})

app.listen(3000)
```

### with AppShell

`index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>App</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <script src="./index.js" defer />
  </head>
  <body>
    <div id="app">Please Enable JavaScript.</div>
  </body>
</html>
```

`html.tsx`:

```tsx
import { h } from 'preact'
import { render } from 'preact-cap'
import { App } from './App.tsx'

export const html = ({ url: string }) => {
  const { head, app } = render(<App url={url} />)
  return `
    <!DOCTYPE html>
    <html lang='en'>
      <head>
        ${head}
        <script src='./index.js' defer />
      </head>
      <body>
        <div id='app'>
          ${app}
        </div>
      </body>
    </html>
  `.trim()
}
```

### without AppShell

`html.tsx`:

```tsx
import { h } from 'preact'
import render from 'preact-render-to-string'
import { Html, Head } from 'preact-cap'
import { App } from './App.tsx'

export const html = ({ url: string }) => {
  return (
    '<!DOCTYPE html>' +
    render(
      <Html lang="en">
        <Head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <script src="./index.js" defer />
        </Head>
        <body>
          <div id="app">
            <App url={url} />
          </div>
        </body>
      </Html>
    ).trim()
  )
}
```
