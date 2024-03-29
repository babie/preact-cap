import assert from 'power-assert'
import { h, Fragment } from 'preact'
import { Cap2, render } from '../src/index'
import { JSDOM } from 'jsdom'

declare const jsdom: JSDOM

describe('small tests', (): void => {
  jsdom.reconfigure({ url: 'https://example.com' })

  beforeEach(() => {
    document.documentElement.lang = 'en'
    document.head.innerHTML = `
      <title>Default Title</title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta content="width=device-width,initial-scale=1" name="viewport" />
      <base href="https://example.com/" target="_self" />
      <link href="main.css" rel="stylesheet" />
      <style>p { color: red; }</style>
      <script src="main.js" defer />
    `.trim()
    document.body.innerHTML = `
      <div id="app">Please Enable JavaScript.</div>
    `.trim()
  })

  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = ''
  })

  const Home: preact.FunctionComponent = () => {
    return (
      <>
        <Cap2>
          <title>Home</title>
        </Cap2>
        <h1>Welcome</h1>
      </>
    )
  }

  const About: preact.FunctionComponent = () => {
    return (
      <>
        <Cap2>
          <title>About</title>
        </Cap2>
        <h1>About</h1>
      </>
    )
  }

  const Japanese: preact.FunctionComponent = () => {
    return (
      <>
        <Cap2 lang="ja">
          <title>日本語</title>
        </Cap2>
        <h1>日本語</h1>
      </>
    )
  }

  /*
  const App: preact.FunctionComponent = ({ url: string }) => {
    return (
      <Router url={url}>
        <Home path="/" />
        <About path="/about" />
        <Japanese path="/ja" />
      </Router>
    )
  }
*/
  describe('render()', (): void => {
    it('update a title tag', (): void => {
      const { head } = render(<Home />)
      assert.ok(new RegExp('<title>Home</title>').test(head))
    })

    it('update an another title tag', (): void => {
      const { head } = render(<About />)
      assert.ok(new RegExp('<title>About</title>').test(head))
    })

    it('update a document.title', (): void => {
      render(<Home />)
      assert(document.title === 'Home')
    })

    it('update an another document.title', (): void => {
      render(<About />)
      assert(document.title === 'About')
    })

    it('update a body', (): void => {
      const { app } = render(<Home />)
      assert(app === '<h1>Welcome</h1>')
    })

    it('update an another body', (): void => {
      const { app } = render(<About />)
      assert(app === '<h1>About</h1>')
    })

    it('does not update a html lang attribute', (): void => {
      render(<Home />)
      assert(document.documentElement.lang === 'en')
    })

    it('update an another html lang attribute', (): void => {
      render(<Japanese />)
      assert(document.documentElement.lang === 'ja')
    })
  })
})
