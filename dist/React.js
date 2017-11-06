(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.React = factory())
})(this, function() {

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
    const { type, props } = vnode
    let node
    if (isClass(type)) { // class Component
      const instance = new type(props)
      instance.props = props
      node = instance.render()
      instance.Vnode = node
    } else { // functional Component
      node = type(props)
    }
    return mount(node)
  }

  const noPXStyle = ['width', 'height']
  function mapProps(props, node) {
    if (props) {
      Object.keys(props).forEach(propName => {
        if (propName === 'style') {
          Object.keys(props[propName]).forEach(styleName => {
            if (noPXStyle.includes(styleName)) {
              node.style[styleName] = `${props[propName][styleName]}px`
            } else {
              node.style[styleName] = props[propName][styleName]
            }
          })
        } else {
          node.setAttribute(propName, props[propName])
        }
      })
    }
  }

  function mapChildren(children, node) {
    if (children) {
      children.forEach(child => {
        const childNode = mount(child)
        node.appendChild(childNode)
      })
    }
  }

  function mountElement(vnode) {
    const { type, props, children } = vnode
    const node = document.createElement(type)
    vnode._hostNode = node // 保存dom节点 为了update时更新插入
    mapProps(props, node)
    mapChildren(children, node)
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

  function Component(props, context) {
    this.props = props
    this.context = context
    this.state = null
  }

  Component.prototype = {
    setState(partialState) {
      const prevState = this.state
      const nextState = {...prevState, ...partialState}
      this.state = nextState

      const oldVnode = this.Vnode
      const newVnode = this.render()
      updateComponent(oldVnode, newVnode)
    },
    isReactComponent: true,
    render() {}
  }

  function isClass(type) {
    return type.prototype && type.prototype.isReactComponent
  }

  function updateComponent(oldVnode, newVnode) {
    if (oldVnode.type === newVnode.type) {
      mapProps(newVnode.props, oldVnode._hostNode)
    }
  }

  const React = {
    createElement,
    render,
    Component,
  }
  window.React = window.ReactDOM = React
  return React
})