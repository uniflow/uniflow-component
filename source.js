import React from 'react'

export default function makeUniflowComponent (Component, stores) {
  return class UniflowComponent extends React.Component {
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
      var storeProps = Object.keys(stores).reduce((memo, key) => {
        memo[key] = stores[key].state
        return memo
      }, {})
      return <Component {...storeProps} {...this.props}/>
    }
  }
}
