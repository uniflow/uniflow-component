import React from 'react'

export default function makeUniflowComponent (Component, stores) {
  return class UniflowComponent extends React.Component {
    constructor () {
      super()
      var storeProps = {}
      Object.keys(stores).forEach(key => storeProps[key] = stores[key].state)
      this.state = { storeProps }
      this.updateStorePropsState = this.updateStorePropsState.bind(this)
    }

    updateStorePropsState () {
      var storeProps = {}
      Object.keys(stores).forEach(key => storeProps[key] = stores[key].state)
      this.setState({ storeProps })
    }

    componentDidMount () {
      Object.keys(stores).forEach(key => {
        stores[key].addListener('change', this.updateStorePropsState)
      })
    }

    componentWillUnmount () {
      Object.keys(stores).forEach(key => {
        stores[key].removeListener('change', this.updateStorePropsState)
      })
    }

    render () {
      return <Component {...this.state.storeProps} {...this.props}/>
    }
  }
}
