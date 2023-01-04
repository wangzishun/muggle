import assert from 'node:assert'
import { test, describe, it } from 'node:test'

import { TestCaseRunner } from '../../shared/test-case-runner.mjs'

import * as solutions from './index.mjs'
import { removeElement } from './index.mjs'

const testcase = [
  {
    input: [[3, 2, 2, 3], 3],
    output: 2,
  },
  {
    input: [[0, 1, 2, 2, 3, 0, 4, 2], 2],
    output: 5,
  },
  {
    input: [[1], 1],
    output: 0,
  },
]

TestCaseRunner(solutions, testcase)

describe(removeElement.name, () => {
  it(() => {
    const input = [1, 1, 2]
    const output = removeElement(input, 2)

    assert.deepEqual(input.slice(0, output), [1, 1])
  })

  it(() => {
    const input = [0, 1, 2, 2, 3, 0, 4, 2]
    const output = removeElement(input, 2)

    assert.deepEqual(input.slice(0, output), [0, 1, 3, 0, 4])
  })
})
