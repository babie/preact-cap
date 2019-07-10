import { h } from 'preact'
import { Cap } from '../src'
import rewire from 'rewire'
import { JSDOM } from 'jsdom'

declare var jsdom: JSDOM

describe('preact-cap', (): void => {
  const myModule = rewire('../dist')
  myModule.__set__('document', jsdom.window.document.defaultView.document)

  afterEach((): void => {
    document.getElementsByTagName('html')[0].innerHTML = ''
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

    it('when nodes has 3 titles', (): void => {
      const nodes = [
        <title key="title1">Title1</title>,
        <title key="title2">Title2</title>,
        <title key="title3">Title3</title>
      ]
      updateTitle(nodes)

      expect(document.title).toStrictEqual('Title1Title2Title3')
    })
  })

  describe('updateOthers', (): void => {
    const updateOthers = myModule.__get__('updateOthers')
    const nodes = [
      <meta
        key="meta1"
        className="preact-cap"
        content="width=device-width,initial-scale=1"
        name="viewport"
      />,
      <base
        key="base1"
        className="preact-cap"
        href="http://localhost/"
        target="_self"
      />,
      <link
        key="link1"
        className="preact-cap"
        href="main.css"
        rel="stylesheet"
      />,
      <style key="style1" className="preact-cap">
        {'p { color: red; }'}
      </style>,
      <script key="script1" className="preact-cap" src="main.js" defer />
    ]
    const meta = document.createElement('meta')
    meta.setAttribute('class', 'preact-cap')
    meta.setAttribute('content', 'width=device-width,initial-scale=1')
    meta.setAttribute('name', 'viewport')
    const base = document.createElement('base')
    base.setAttribute('class', 'preact-cap')
    base.setAttribute('href', 'http://localhost/')
    base.setAttribute('target', '_self')
    const link = document.createElement('link')
    link.setAttribute('class', 'preact-cap')
    link.setAttribute('href', 'main.css')
    link.setAttribute('rel', 'stylesheet')
    const style = document.createElement('style')
    style.setAttribute('class', 'preact-cap')
    style.textContent = 'p { color: red; }'
    const script = document.createElement('script')
    script.setAttribute('class', 'preact-cap')
    script.setAttribute('defer', 'true')
    script.setAttribute('src', 'main.js')
    const elements = [meta, base, link, style, script]

    beforeEach((): void => {
      updateOthers(nodes)
    })

    it('when create', (): void => {
      const tags = Array.from(document.head.querySelectorAll('.preact-cap'))

      expect(tags).toStrictEqual(elements)
    })

    it('when remove', (): void => {
      updateOthers([])
      const tags = Array.from(document.head.querySelectorAll('.preact-cap'))

      expect(tags).toStrictEqual([])
    })

    it('when update', (): void => {
      const newNodes = nodes.slice(0, nodes.length)
      newNodes[2] = (
        <link
          key="link1"
          className="preact-cap"
          href="another.css"
          rel="stylesheet"
        />
      )
      updateOthers(newNodes)
      const tags = Array.from(document.head.querySelectorAll('.preact-cap'))

      const newElements = elements.slice(0, elements.length)
      const newLink = document.createElement('link')
      newLink.setAttribute('class', 'preact-cap')
      newLink.setAttribute('href', 'another.css')
      newLink.setAttribute('rel', 'stylesheet')
      newElements[2] = newLink

      expect(tags.sort()).toStrictEqual(newElements.sort())
    })
  })

  describe('Cap.rewind()', (): void => {
    it('when no head tags', (): void => {
      expect(Cap.rewind()).toStrictEqual([])
    })
  })
})
