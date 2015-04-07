# Uniflow React Component

The best way to subscribe to Uniflow stores in React components.

- Automatically handles subscribing and unsubscribing to store change events.
- Lets you write components that accept store state as a prop.

## Install

```sh
$ npm install uniflow-component --save
```

## Usage

All props given to the `UniflowComponent` are expected to be Uniflow stores. For
each store prop, a prop of the same name is added to the `UniflowComponent`'s
child component. All store props are automatically subscribed to, and any
included store that fires a change event will rerender.

Since the actual store state is used for the props on the child element,
the react pure render mixin is supported if used by a child element.

```js
import ThingStore from './stores/thing'
import React from 'react'
import UniflowComponent from 'uniflow-component'

class HigerOrderComponent extends React.Component {
  render () {
    return (
      <UniflowComponent thing={ThingStore}>
        <DumbComponent/>
      </UniflowComponent>
    )
  }
}


class DumbComponent extends React.Component {
  render () {
    return <div>{this.props.thing.name}</div>
  }
}
```
