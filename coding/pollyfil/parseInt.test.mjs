import { describe, it } from 'node:test'
import assert from 'node:assert'

import { _parseInt } from './parseInt.mjs'

describe(_parseInt.name, () => {
  it(() => {
    assert.equal(_parseInt('123', 10), parseInt('123', 10))
  })

  it(() => {
    assert.equal(_parseInt('123', 0), parseInt('123', 0))
  })

  it(() => {
    assert.equal(_parseInt('123', 1), parseInt('123', 1))
  })

  it(() => {
    assert.equal(_parseInt('123', 2), parseInt('123', 2))
  })

  it(() => {
    assert.equal(_parseInt('123', 3), parseInt('123', 3))
  })

  it(() => {
    assert.equal(_parseInt('123', 5), parseInt('123', 5))
  })

  it(() => {
    assert.equal(_parseInt('123', 6), parseInt('123', 6))
  })

  it(() => {
    assert.equal(_parseInt('123', 7), parseInt('123', 7))
  })

  it(() => {
    assert.equal(_parseInt('123', 8), parseInt('123', 8))
  })

  it(() => {
    assert.equal(_parseInt('123', 9), parseInt('123', 9))
  })

  it(() => {
    assert.equal(_parseInt('123'), parseInt('123'))
  })

  it(() => {
    assert.equal(_parseInt('ab', 16), parseInt('ab', 16))
  })
})
