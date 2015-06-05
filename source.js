import React from 'react'

export default function makeUniflowComponent (Component, stores) {
  return Object.assign(class UniflowComponent extends React.Component {
    constructor () {
      super()
      this.forceUpdate = this.forceUpdate.bind(this)
    }

    componentDidMount () {
      Object.keys(stores).forEach(key => {
        stores[key].addListener('change', this.forceUpdate)
      })
    }

    componentWillUnmount () {
      Object.keys(stores).forEach(key => {
        stores[key].removeListener('change', this.forceUpdate)
      })
    }

    render () {
      var storeProps = {}
      Object.keys(stores).forEach(key => storeProps[key] = stores[key].state)
      return <Component {...storeProps} {...this.props}/>
    }
  }, Component)
}
