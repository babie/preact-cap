import assert from 'power-assert'
import { h, Fragment } from 'preact'
import { Cap2, render } from '../src/index'
import { JSDOM } from 'jsdom'

declare const jsdom: JSDOM

describe('small tests', (): void => {
  jsdom.reconfigure({ url: 'https://example.com' })

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
  /*
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
    it('update title tag', (): void => {
      const { head } = render(<Home />)
      assert(head === '<title>Home</title>')
    })

    it('update document.title', (): void => {
      render(<Home />)
      assert(document.title === 'Home')
    })

    it('render app', (): void => {
      const { app } = render(<Home />)
      assert(app === '<h1>Welcome</h1>')
    })
  })
})
