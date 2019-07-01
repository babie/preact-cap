import { h } from 'preact'
import { Cap } from '../src'
import rewire from 'rewire'
import { JSDOM } from 'jsdom'

declare var jsdom: JSDOM

describe('preact-cap', (): void => {
  const myModule = rewire('../dist')
  myModule.__set__('document', jsdom.window.document.defaultView.document)
  const nodeToDOM = myModule.__get__('nodeToDOM')

  it('nodeToDOM()', (): void => {
    const node = <meta name="description">Meta</meta>
    const el = document.createElement('meta')
    el.setAttribute('name', 'description')
    el.textContent = 'Meta'
    expect(nodeToDOM(node)).toStrictEqual(el)
  })

  it('Cap.rewind()', (): void => {
    expect(Cap.rewind()).toStrictEqual([])
  })
})
