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

  describe('updateHead()', (): void => {
    const nodes = [
      <title key="title">Default Title</title>,
      <meta
        key="meta"
        className="preact-cap"
        content="width=device-width,initial-scale=1"
        name="viewport"
      />,
      <base
        key="base"
        className="preact-cap"
        href="http://localhost/"
        target="_self"
      />,
      <link
        key="link"
        className="preact-cap"
        href="main.css"
        rel="stylesheet"
      />,
      <style key="style" className="preact-cap">
        {'p { color: red; }'}
      </style>,
      <script key="script" className="preact-cap" src="main.js" defer />
    ]
    const title = document.createElement('title')
    title.textContent = 'Default Title'
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
    const elements = [title, meta, base, link, style, script]

    describe('updateTitle()', (): void => {
      const updateTitle = myModule.__get__('updateTitle')

      it('when nodes has 1 title', (): void => {
        const titleNodes = [nodes[0]]
        updateTitle(titleNodes)

        expect(document.title).toStrictEqual('Default Title')
      })

      it('when nodes has 3 titles', (): void => {
        const titleNodes = [
          <title key="title1">Title1</title>,
          <title key="title2">Title2</title>,
          <title key="title3">Title3</title>
        ]
        updateTitle(titleNodes)

        expect(document.title).toStrictEqual('Title1Title2Title3')
      })
    })

    describe('updateOthers()', (): void => {
      const updateOthers = myModule.__get__('updateOthers')
      const othersNodes = nodes.slice(1, nodes.length)
      const othersElements = elements.slice(1, elements.length)

      it('when created', (): void => {
        updateOthers(othersNodes)
        const tags = Array.from(document.head.querySelectorAll('.preact-cap'))

        expect(tags).toStrictEqual(othersElements)
      })

      it('when removed', (): void => {
        updateOthers(othersNodes)
        updateOthers([])
        const tags = Array.from(document.head.querySelectorAll('.preact-cap'))

        expect(tags).toStrictEqual([])
      })

      it('when updated', (): void => {
        updateOthers(othersNodes)
        const newNodes = othersNodes.slice(0, nodes.length)
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

        const newElements = othersElements.slice(0, elements.length)
        const newLink = document.createElement('link')
        newLink.setAttribute('class', 'preact-cap')
        newLink.setAttribute('href', 'another.css')
        newLink.setAttribute('rel', 'stylesheet')
        newElements[2] = newLink

        expect(tags.sort()).toStrictEqual(newElements.sort())
      })
    })

    const updateHead = myModule.__get__('updateHead')
    it('when created', (): void => {
      updateHead(nodes)
      const tags = Array.from(document.head.children)

      expect(tags).toStrictEqual(elements)
    })

    it('when removed', (): void => {
      updateHead(nodes)
      updateHead([])
      const tags = Array.from(document.head.children)

      expect(tags).toStrictEqual([title])
    })

    it('when updated', (): void => {
      updateHead(nodes)
      const newNodes = nodes.slice(0, nodes.length)
      newNodes[0] = <title>Updated Title</title>
      newNodes[5] = <script className="preact-cap" src="another.js" defer />
      updateHead(newNodes)
      const tags = Array.from(document.head.children)

      const newElements = elements.slice(0, elements.length)
      const newTitle = document.createElement('title')
      newTitle.textContent = 'Updated Title'
      const newScript = document.createElement('script')
      newScript.setAttribute('class', 'preact-cap')
      newScript.setAttribute('src', 'another.js')
      newScript.setAttribute('defer', 'true')
      newElements[0] = newTitle
      newElements[5] = newScript

      expect(tags.sort()).toStrictEqual(newElements.sort())
    })
  })

  describe('unique()', (): void => {
    const unique = myModule.__get__('unique')

    it('when duplicated', (): void => {
      const expected = [
        <title key="title">Default Title</title>,
        <meta key="charSet" charSet="utf-8" />,
        <meta key="name" name="description" content="this is a description" />,
        <meta
          key="http-equiv"
          httpEquiv="content-type"
          content="text/html; charset=utf-8"
        />,
        <meta
          key="itemprop"
          itemProp="description"
          content="this is a description"
        />,
        <base key="base" href="http://localhost/" target="_self" />
      ]
      const duplicated = [
        <title key="title">Duplicated Title</title>,
        <meta key="charSet" charSet="euc-jp" />,
        <meta
          key="name"
          name="description"
          content="this is a duplicate description"
        />,
        <meta
          key="http-equiv"
          httpEquiv="content-type"
          content="text/html; charset=euc-jp"
        />,
        <meta
          key="itemprop"
          itemProp="description"
          content="this is a duplicate description"
        />,
        <base key="base" href="http://localhost/duplicated/" target="_self" />
      ]
      const recieved = expected.concat(duplicated).filter(unique())

      expect(recieved).toStrictEqual(expected)
    })
  })

  describe('Cap.rewind()', (): void => {
    it('when no head tags', (): void => {
      expect(Cap.rewind()).toStrictEqual([])
    })
  })
})
