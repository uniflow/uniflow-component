/* global describe, it, beforeEach, afterEach */

import should from 'should'
import sinon from 'sinon'
import React from 'react'
import EventEmitter from 'eventemitter3'
import jsdom from 'mocha-jsdom'
import Store from './source'

function makeMockStore () {
  let store = new EventEmitter()
  sinon.spy(store, 'addListener')
  sinon.spy(store, 'removeListener')
  store.state = {}
  return store
}

describe('<UniflowComponent/>', () => {
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
    React.render(<Store a={storeA} b={storeB}><div/></Store>, domNode)
    sinon.assert.called(storeA.addListener)
    sinon.assert.called(storeB.addListener)
  })

  it('throws when rendered with non-store props', () => {
    let fn = () => React.render(<Store a="foo"><div/></Store>, domNode)
    fn.should.throw()
  })

  it('handles adding props', () => {
    React.render(<Store a={storeA}><div/></Store>, domNode)
    React.render(<Store a={storeA} b={storeB}><div/></Store>, domNode)
    sinon.assert.calledOnce(storeA.addListener)
    sinon.assert.calledOnce(storeB.addListener)
  })

  it('handles changing props', () => {
    React.render(<Store a={storeA}><div/></Store>, domNode)
    React.render(<Store a={storeB}><div/></Store>, domNode)
    sinon.assert.calledOnce(storeA.removeListener)
    sinon.assert.calledOnce(storeB.addListener)
  })

  it('handles removing props', () => {
    React.render(<Store a={storeA} b={storeB}><div/></Store>, domNode)
    React.render(<Store a={storeA}><div/></Store>, domNode)
    sinon.assert.calledOnce(storeB.removeListener)
  })

  it('unsubscribes to all props when unmounting', () => {
    React.render(<Store a={storeA} b={storeB}><div/></Store>, domNode)
    React.render(<div/>, domNode)
    sinon.assert.called(storeA.removeListener)
    sinon.assert.called(storeB.removeListener)
  })

  it('it transfers the state of each prop to the child', () => {
    class Child extends React.Component {
      render () {
        this.props.a.should.equal(storeA.state)
        this.props.b.should.equal(storeB.state)
        return <div/>
      }
    }
    React.render(<Store a={storeA} b={storeB}><Child/></Store>, domNode)
  })

  it('throws with zero children', () => {
    let fn = () => React.render(<Store/>, domNode)
    fn.should.throw()
  })

  it('throws with more than one child', () => {
    let fn = () => React.render(<Store><div/><div/></Store>, domNode)
    fn.should.throw()
  })

  it('re-renders when any store prop emits change event', () => {
    let render = sinon.spy(Store.prototype, 'render')
    React.render(<Store a={storeA}><div/></Store>, domNode)
    sinon.assert.calledOnce(render)
    storeA.emit('change')
    sinon.assert.calledTwice(render)
    Store.prototype.render.restore()
  })
})
