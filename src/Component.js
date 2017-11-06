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
    updateComponent()
  },
  isReactComponent: true,
  render() {}
}

function isClass(type) {
  return type.prototype && type.prototype.isReactComponent
}

function updateComponent(oldVnode, newVnode) {
  if (oldVnode.type === newVnode.type) {

  }
}

export {
  Component,
  isClass,
}