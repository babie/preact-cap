import { h } from 'preact'
import { Cap } from '../src'
import rewire from 'rewire'
import { JSDOM } from 'jsdom'

declare var jsdom: JSDOM

describe('preact-cap', (): void => {
  const myModule = rewire('../dist')
  beforeEach((): void => {
    myModule.__set__('document', jsdom.window.document.defaultView.document)
  })

  describe('nodeToDOM()', (): void => {
    const nodeToDOM = myModule.__get__('nodeToDOM')

    it('when node has children', (): void => {
      const node = <meta name="description">Meta</meta>
      const el = document.createElement('meta')
      el.setAttribute('name', 'description')
      el.textContent = 'Meta'

      expect(nodeToDOM(node)).toStrictEqual(el)
    })

    it('when node has dengerouslySetInnerHTML', (): void => {
      const node = (
        <meta
          name="description"
          dangerouslySetInnerHTML={{ __html: '<span>Span</span>' }}
        />
      )
      const el = document.createElement('meta')
      el.setAttribute('name', 'description')
      el.innerHTML = '<span>Span</span>'

      expect(nodeToDOM(node)).toStrictEqual(el)
    })
  })

  describe('updateTitle()', (): void => {
    const updateTitle = myModule.__get__('updateTitle')

    it('when nodes has 1 title', (): void => {
      const nodes = [<title key="title1">Title1</title>]
      updateTitle(nodes)

      expect(document.title).toStrictEqual('Title1')
    })
  })

  describe('Cap.rewind()', (): void => {
    it('when no head tags', (): void => {
      expect(Cap.rewind()).toStrictEqual([])
    })
  })
})
