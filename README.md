# preact-cap

&lt;head> tags updater on [preact](https://github.com/preactjs/preact)

## Install

```shell
$ npm install preact-cap
```
or
```shell
$ yarn add preact-cap
```

## Usage

```tsx
import { h, render } from 'preact'
import { Cap } from 'preact-cap'

export const App = () => {
  return (
    <Cap>
      <title>App</title>
    </Cap>
    <h1>Top Page</h1>
  )
}

render(App, document.body)
```

## Server-Side Rendering

`App.tsx`:
```tsx
import { h } from 'preact'
import { Router } from 'preact-router'
import { Link } from 'preact-router/match'
import { Cap } from 'preact-cap'

export const Home = () => {
  return (
    <Cap>
      <title>Home</title>
    </Cap>
    <h1>Welcome</h1>
    <Link href='/about'>About</Link>
  )
}

export const About = () => {
  return (
    <Cap>
      <title>About</title>
    </Cap>
    <h1>About</h1>
    <Link href='/'>Home</Link>
  )
}

export const App = ({ url: string }) => {
  return (
    <Router url={url}>
      <Home path='/' />
      <About path='/about' />
    </Router>
  )
}
```

### with AppShell

`index.html`:

`html.ts`:

`server.ts`:

### without AppShell

`html.tsx`:
```tsx
import { h } from 'preact'
import { Html, Head } from 'preact-cap'
import { App } from './App.tsx'

export const html = ({ url: string }) => {
  return (
    <Html lang='en'>
      <Head>
        <script src='./index.js' />
      </Head>
      <body>
        <div id='app'>
          <App url={url}/>
        </div>
        <script language='javascript'>
          hydrate(App({ url }), document.getElementById('app'))
        </script>
      </body>
    </Html>
  )
}
```

`server.ts`:
```ts
import express from 'express'
import render from 'preact-render-to-string'
import { html } from './html'

const app = express()

app.get('index.js', (req, res) => {
  res.set('Content-Type', 'text/javascript')
  res.sendFile('./index.js')
})

app.get('*', (req, res) => {
  const doc = `<!doctype html>` + render(html({ url: req.url })).trim()
  res.send(doc)
})

app.listen(3000, () =>
  console.log('Server listening on port 3000. Open http://localhost:3000/')
)
```