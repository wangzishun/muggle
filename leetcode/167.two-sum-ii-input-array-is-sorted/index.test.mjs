import { TestCaseRunner } from '../../shared/test-case-runner.mjs'

import * as solutions from './index.mjs'

const testcase = [
  {
    input: [[2, 7, 11, 15], 9],
    output: [1, 2],
  },
  {
    input: [[2, 3, 4], 6],
    output: [1, 3],
  },
  {
    input: [[3, 3], 6],
    output: [1, 2],
  },

  {
    input: [[0, 0, 4, 3], 0],
    output: [1, 2],
  },
  {
    input: [[-1, 0], -1],
    output: [1, 2],
  },
]

TestCaseRunner(solutions, testcase)
