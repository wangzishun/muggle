import { TestCaseRunner } from '../../shared/test-case-runner.mjs'

import * as solutions from './index.mjs'

const testcase = [
  {
    input: [[2, 7, 11, 15], 9],
    output: [0, 1],
  },
  {
    input: [[3, 2, 4], 6],
    output: [1, 2],
  },
  {
    input: [[3, 3], 6],
    output: [0, 1],
  },

  {
    input: [[0, 4, 3, 0], 0],
    output: [0, 3],
  },
]

TestCaseRunner(solutions, testcase)
