import { h, VNode } from 'preact'
import { Router } from 'preact-router'
import { Home, Sub1, Sub2 } from './app/components'

interface Props {
  url: string
}
export const App = ({ url }: Props): VNode => (
  <Router url={url}>
    <Home path="/" />
    <Sub1 path="/sub1" />
    <Sub2 path="/sub2" />
  </Router>
)
