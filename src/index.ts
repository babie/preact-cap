import { Component } from 'preact'

interface Props {
  children: Component
}
export const Cap = ({ children }: Props): Component => children
