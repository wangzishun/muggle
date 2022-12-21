import assert from 'node:assert'
import { test, describe, it } from 'node:test'

import * as PriorityQueue from './index.mjs'

describe('PriorityQueue', () => {
  it('case 1', async () => {
    const queue = new PriorityQueue([5, 4, 3, 2, 1, 10, 6, 7, 8, 9])

    assert.deepEqual(queue.pop(), 10)
    assert.deepEqual(queue.pop(), 9)
    assert.deepEqual(queue.pop(), 8)
    assert.deepEqual(queue.pop(), 7)
    assert.deepEqual(queue.pop(), 6)
    assert.deepEqual(queue.pop(), 5)
    assert.deepEqual(queue.pop(), 4)
    assert.deepEqual(queue.pop(), 3)
    assert.deepEqual(queue.pop(), 2)
    assert.deepEqual(queue.pop(), 1)
  })
})
