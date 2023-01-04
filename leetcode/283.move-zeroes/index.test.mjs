import { TestCaseRunner } from '../../shared/test-case-runner.mjs'

import * as solutions from './index.mjs'

const testcase = [
  {
    input: [[0, 1, 0, 3, 12]],
    output: [1, 3, 12, 0, 0],
  },
  {
    input: [[0]],
    output: [0],
  },
  {
    input: [[1, 0, 1]],
    output: [1, 1, 0],
  },
  {
    input: [[11, 12, 14, 20, 0, 99, 0, 0, 1]],
    output: [11, 12, 14, 20, 99, 1, 0, 0, 0],
  },
]

TestCaseRunner(solutions, testcase)
