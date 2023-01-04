import assert from 'node:assert'
import { test, describe, it } from 'node:test'

import { TestCaseRunner } from '../../shared/test-case-runner.mjs'

import * as solutions from './index.mjs'
import { removeDuplicates } from './index.mjs'

const testcase = [
  {
    input: [[1, 1, 2]],
    output: 2,
  },
  {
    input: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]],
    output: 5,
  },
]

TestCaseRunner(solutions, testcase)

describe(removeDuplicates.name, () => {
  it(() => {
    const input = [1, 1, 2]
    const output = removeDuplicates(input)

    assert.deepEqual(input.slice(0, output), [1, 2])
  })

  it(() => {
    const input = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]
    const output = removeDuplicates(input)

    assert.deepEqual(input.slice(0, output), [0, 1, 2, 3, 4])
  })
})
