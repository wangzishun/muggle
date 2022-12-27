import { TestCaseRunner } from '../../shared/test-case-runner.mjs'

import * as solutions from './index.mjs'

const testcase = [
  {
    input: [[1, 0, -1, 0, -2, 2], 0],
    output: [
      [-2, -1, 1, 2],
      [-2, 0, 0, 2],
      [-1, 0, 0, 1],
    ],
  },
  {
    input: [[2, 2, 2, 2, 2], 8],
    output: [[2, 2, 2, 2]],
  },
]

TestCaseRunner(solutions, testcase)
