import React from 'react'

function keysWithoutChildren (props) {
  return Object.keys(props).filter(key => key !== 'children')
}

export default class UniflowComponent extends React.Component {
  constructor () {
    super()
    this.forceUpdate = this.forceUpdate.bind(this)
  }

  updateSubscriptions (oldProps, newProps) {
    let oldKeys = keysWithoutChildren(oldProps)
    let newKeys = keysWithoutChildren(newProps)

    newKeys.forEach(key => {
      if (newProps[key] !== oldProps[key]) {
        if (oldProps[key]) {
          oldProps[key].removeListener('change', this.forceUpdate)
        }
        newProps[key].addListener('change', this.forceUpdate)
      }
    })

    oldKeys.forEach(key => {
      if (!newProps[key]) {
        oldProps[key].removeListener('change', this.forceUpdate)
      }
    })
  }

  componentDidMount () {
    this.updateSubscriptions({}, this.props)
  }

  componentWillReceiveProps (newProps) {
    this.updateSubscriptions(this.props, newProps)
  }

  componentWillUnmount () {
    this.updateSubscriptions(this.props, {})
  }

  render () {
    let storeProps = {}

    keysWithoutChildren(this.props).forEach(key => {
      storeProps[key] = this.props[key].state
    })

    return React.cloneElement(this.props.children, storeProps)
  }
}

UniflowComponent.propTypes = {
  children: React.PropTypes.element.isRequired
}
