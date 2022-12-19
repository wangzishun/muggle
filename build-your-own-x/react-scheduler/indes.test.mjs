import { describe, it } from 'node:test'
import assert from 'node:assert'

import * as scheduler from './indes.mjs'

describe('scheduler', () => {
  it('getCurrentTime', () => {
    assert.equal(scheduler.getCurrentTime(), performance.now())
  })
})

