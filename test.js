/* global describe, it, beforeEach, afterEach */

import should from 'should'
import sinon from 'sinon'
import React from 'react'
import EventEmitter from 'eventemitter3'
import jsdom from 'mocha-jsdom'
import make from './source'

function makeMockStore () {
  let store = new EventEmitter()
  sinon.spy(store, 'addListener')
  sinon.spy(store, 'removeListener')
  store.state = {}
  return store
}

class TestComponent {
  render () {
    return <div/>
  }
}

describe('makeUniflowComponent()', () => {
  jsdom()

  let domNode
  let storeA
  let storeB

  beforeEach(() => {
    domNode = document.createElement('div')
    storeA = makeMockStore()
    storeB = makeMockStore()
    sinon.stub(console, 'warn')
  })

  afterEach(() => {
    console.warn.restore()
  })

  it('subscribes to all props after mounting', () => {
    let Component = make(TestComponent, {a: storeA, b: storeB})
    React.render(<Component/>, domNode)
    sinon.assert.called(storeA.addListener)
    sinon.assert.called(storeB.addListener)
  })

  it('throws when rendered with non-store props', () => {
    let Component = make(TestComponent, {a: 'foo'})
    let fn = () => React.render(<Component/>, domNode)
    fn.should.throw()
  })

  it('unsubscribes to all props when unmounting', () => {
    let Component = make(TestComponent, {a: storeA, b: storeB})
    React.render(<Component/>, domNode)
    React.render(<div/>, domNode)
    sinon.assert.called(storeA.removeListener)
    sinon.assert.called(storeB.removeListener)
  })

  it('it adds the state of each store as a prop to the component', () => {
    class Child extends React.Component {
      render () {
        this.props.a.should.equal(storeA.state)
        this.props.b.should.equal(storeB.state)
        return <div/>
      }
    }
    Child.propTypes = {
      a: React.PropTypes.object,
      b: React.PropTypes.object
    }
    let Component = make(Child, {a: storeA, b: storeB})
    React.render(<Component/>, domNode)
  })

  it('re-renders when any store prop emits change event', () => {
    let Component = make(TestComponent, {a: storeA})
    let render = sinon.spy(Component.prototype, 'render')
    React.render(<Component/>, domNode)
    sinon.assert.calledOnce(render)
    storeA.emit('change')
    sinon.assert.calledTwice(render)
    Component.prototype.render.restore()
  })

  it('copies static properties from source component', () => {
    class Source extends React.Component {}
    Source.staticProp1 = {}
    const Dest = make(Source, {a: storeA, b: storeB})
    Dest.staticProp1.should.be.exactly(Source.staticProp1)
  })
})
