import { TestCaseRunner } from '../../shared/test-case-runner.mjs'

import * as solutions from './index.mjs'

const testcase = [
  {
    input: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]],
    output: 6,
  },
  {
    input: [[4, 2, 0, 3, 2, 5]],
    output: 9,
  },
  {
    input: [[4, 2, 3]],
    output: 1,
  },
  {
    input: [[5, 4, 1, 2]],
    output: 1,
  },
  {
    input: [[1, 2, 1]],
    output: 0,
  },
  {
    input: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
    output: 0,
  },
]

TestCaseRunner(solutions, testcase)
