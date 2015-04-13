# Uniflow React Component

The best way to subscribe to Uniflow stores in React components.

- Automatically handles subscribing and unsubscribing to store change events.
- Lets you write components that accept store state as a prop.

## Install

```sh
$ npm install uniflow-component --save
```

## Usage

```js
import ThingStore from './stores/thing'
import React from 'react'
import uniflowComponent from 'uniflow-component'

export class ThingPreview extends React.Component {
  render () {
    return <div>{this.props.thing.name}</div>
  }
}

export default uniflowComponent(ThingPreview, {thing: ThingStore})
```
