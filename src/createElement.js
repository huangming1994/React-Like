import { isClass, Component } from 'Component'

function VNode(type, props, children) {
  this.type = type
  this.props = props
  this.children = children
}

function createElement(type, props, ...args) {
  let children = args.length > 0 ? args : null
  return new VNode(type, props, children)
}

function mountText(text) {
  return document.createTextNode(text)
}

function mountComposite(vnode) {
  const { type } = vnode.type
  if (isClass(type)) { // class Component
    console.log('type-----_>', type)
  } else { // functional Component
    const node = type(vnode.props)
    return mount(node)
  }
}

function mountElement(vnode) {
  const { type, props, children } = vnode
  const node = document.createElement(type)
  if (props) {
    Object.keys(props).forEach(propName => {
      node.setAttribute(propName, props[propName])
    })
  }
  if (children) {
    children.forEach(child => {
      const childNode = mount(child)
      node.appendChild(childNode)
    })
  }
  return node
}

function mount(vnode) {
  if (typeof vnode === 'string') {
    return mountText(vnode)
  }
  if (typeof vnode.type === 'string') {
    return mountElement(vnode)
  }
  if (typeof vnode.type === 'function') {
    return mountComposite(vnode)
  }
}

function renderByReact(vnode, container) {
  const realNode = mount(vnode)
  container.appendChild(realNode)
  return realNode
}

function render(vnode, container) {
  return renderByReact(vnode, container)
}

window.ReactDOM = {
  render,
}

window.React = {
  createElement,
}
