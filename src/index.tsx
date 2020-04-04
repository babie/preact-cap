import { h, Component, cloneElement, toChildArray, createContext } from 'preact'
import { useContext, useReducer } from 'preact/hooks'
import { render as renderToString } from 'preact-render-to-string'
let caps: preact.Component[] = []

type TitleVNodeType = 'title'
type OthersVNodeType = 'meta' | 'base' | 'link' | 'style' | 'script'
interface TitleVNode extends preact.VNode {
  type: TitleVNodeType
  props: { children: string }
}
interface OthersVNode extends preact.VNode<preact.JSX.HTMLAttributes> {
  type: OthersVNodeType
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isVNode = (node: any): boolean =>
  !!node &&
  typeof node === 'object' &&
  !!node.type &&
  typeof node.type === 'string'

const isTitleVNode = (node: preact.VNode): boolean =>
  isVNode(node) &&
  node.type === 'title' &&
  !!node.props &&
  typeof node.props === 'object' &&
  !!node.props.children &&
  typeof node.props.children === 'string'

const isOthersVNode = (node: preact.VNode): boolean =>
  isVNode(node) &&
  ['meta', 'base', 'link', 'style', 'script'].includes(node.type as string)

interface AttributeNames {
  [key: string]: string
}
const attributeNames: AttributeNames = {
  acceptCharset: 'accept-charset',
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv',
}

const nodeToDOM = (node: OthersVNode): HTMLElement => {
  const el = document.createElement(node.type)
  if (!!node.props && typeof node.props === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const [key, value] of Object.entries<any>(node.props)) {
      if (key === 'dangerouslySetInnerHTML') continue
      if (key === 'children') continue
      el.setAttribute(attributeNames[key] || key.toLowerCase(), value)
    }
    if (node.props.dangerouslySetInnerHTML) {
      el.innerHTML = node.props.dangerouslySetInnerHTML.__html
    } else if (typeof node.props.children === 'string') {
      el.textContent = node.props.children
    }
  }
  return el
}

const updateOthers = (nodes: OthersVNode[]): void => {
  const tagsForRemove = Array.from(
    document.head.querySelectorAll('.preact-cap')
  )
  const tagsForAppend = nodes.map(nodeToDOM).filter((el): boolean => {
    for (const [i, v] of tagsForRemove.entries()) {
      if (el.isEqualNode(v)) {
        // keep
        tagsForRemove.splice(i, 1)
        return false
      }
    }
    return true
  })
  tagsForRemove.forEach((el): void => {
    document.head.removeChild(el)
  })
  tagsForAppend.forEach((el): void => {
    document.head.appendChild(el)
  })
}

const updateTitle = (nodes: TitleVNode[]): void => {
  if (nodes.length > 0) {
    document.title = nodes.map((node): string => node.props.children).join('')
  }
}

const updateHead = (nodes: preact.VNode[]): void => {
  updateTitle(nodes.filter((node): node is TitleVNode => isTitleVNode(node)))
  updateOthers(nodes.filter((node): node is OthersVNode => isOthersVNode(node)))
}

interface UniqueReturnFunc {
  (node: preact.VNode): boolean
}
const unique = (): UniqueReturnFunc => {
  const tags: string[] = []
  const attrKeys: string[] = []
  const attrValues: {
    name?: string[]
    httpEquiv?: string[]
    itemProp?: string[]
  } = {}
  let value: string | undefined
  let values: string[]
  return (node: preact.VNode<preact.JSX.HTMLAttributes>): boolean => {
    switch (node.type) {
      case 'title':
      case 'base':
        if (tags.includes(node.type)) return false
        tags.push(node.type)
        break
      case 'meta':
        if (!!node.props && typeof node.props === 'object') {
          for (const key of Object.keys(node.props)) {
            switch (key) {
              case 'charSet':
                if (attrKeys.includes(key)) return false
                attrKeys.push(key)
                break
              case 'name':
              case 'httpEquiv':
              case 'itemProp':
                value = node.props[key]
                if (value) {
                  values = attrValues[key] || []
                  if (values.includes(value)) return false
                  attrValues[key] = [...values, value]
                }
                break
            }
          }
        }
        break
    }
    return true
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getClassName = (node: any): string => {
  if (
    !!node &&
    typeof node === 'object' &&
    !!node.props &&
    typeof node.props === 'object' &&
    !!node.props.className &&
    typeof node.props.className === 'string'
  ) {
    return node.props.className
  }
  return ''
}

const reduceNodes = (caps: preact.Component[]): preact.VNode[] => {
  return caps
    .map<preact.ComponentChild>(
      (cap): preact.ComponentChildren => cap.props.children
    )
    .flat()
    .filter((child): child is preact.VNode => isVNode(child))
    .filter(unique())
    .map<preact.VNode>(
      (node): preact.VNode => {
        const className = [getClassName(node), 'preact-cap'].join(' ').trim()
        return cloneElement(node, { className })
      }
    )
}

const browser = typeof window !== 'undefined'
const update = (): void => {
  if (browser) {
    const nodes = reduceNodes(caps)
    updateHead(nodes)
  }
}

export class Cap extends Component {
  public static rewind(): preact.VNode[] {
    const nodes = reduceNodes(caps)
    caps = []
    return nodes
  }

  public static toString(): string {
    return this.rewind()
      .map((node) => renderToString(node))
      .join('')
  }

  constructor(props: {}) {
    super(props)
    caps.push(this)
  }

  public componentDidMount(): void {
    update()
  }

  public componentDidUpdate(): void {
    update()
  }

  public componentWillUnmount(): void {
    const i = caps.indexOf(this)
    if (i >= 0) {
      caps.splice(i, 1)
    }
    update()
  }

  public render(): preact.ComponentChild {
    return null
  }
}

interface CapState {
  provided: boolean
  headTags: preact.VNode[]
  htmlAttrs: {
    lang: string
  }
}
interface CapAction {
  type: string
  payload: preact.VNode[] | {}
}
const initialState: CapState = {
  provided: false,
  headTags: [],
  htmlAttrs: { lang: 'en' },
}
const reducer = (
  state: CapState = initialState,
  action: CapAction
): CapState => {
  switch (action.type) {
    case 'ADD_HEAD_TAGS':
      return {
        ...state,
        headTags: [...state.headTags, ...(action.payload as preact.VNode[])],
      }
    case 'UPDATE_HTML_ATTRS':
      return {
        ...state,
        htmlAttrs: { ...state.htmlAttrs, ...(action.payload as {}) },
      }
    default:
      return state
  }
}
interface CapValue {
  state: CapState
  dispatch: (action: CapAction) => void
}
const initialDispatch = (_action: CapAction): void => {
  // nothing
  return
}
const initialValue: CapValue = {
  state: initialState,
  dispatch: initialDispatch,
}
export const CapContext = createContext(initialValue)
export const Html: preact.FunctionComponent<{ lang?: string }> = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  if (props.lang !== undefined) {
    dispatch({ type: 'ADD_HTML_ATTRS', payload: { lang: props.lang } })
  }
  return (
    <CapContext.Provider
      value={{ state: { ...state, provided: true }, dispatch }}
    >
      <CapContext.Consumer>
        {(value: CapValue): preact.ComponentChildren => (
          <html lang={value.state.htmlAttrs.lang}>{props.children}</html>
        )}
      </CapContext.Consumer>
    </CapContext.Provider>
  )
}
export const Head: preact.FunctionComponent = () => {
  return (
    <head>
      <CapContext.Consumer>
        {(value: CapValue): preact.ComponentChildren => value.state.headTags}
      </CapContext.Consumer>
    </head>
  )
}
export const Cap2: preact.FunctionComponent = (props) => {
  const vnodes = toChildArray(
    props.children
  ).filter((child): child is preact.VNode => isVNode(child))

  const { state, dispatch } = useContext(CapContext)
  if (state.provided) {
    dispatch({ type: 'ADD_HEAD_TAGS', payload: vnodes })
  } else {
    // TODO: Cap2 nest case
    updateHead(vnodes)
  }

  return null
}
interface RenderReturn {
  head: string
  app: string
}
export const render = (vnode: preact.VNode): RenderReturn => {
  const app = renderToString(vnode)
  const head = document.head.innerHTML
  return { head, app }
}
