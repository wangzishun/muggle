
import { TestCaseRunner } from '../../shared/test-case-runner.mjs'

import * as solutions from './index.mjs'

const testcase = [
  {
    input: [[-1, 0, 1, 2, -1, -4]],
    output: [
      [-1, -1, 2],
      [-1, 0, 1],
    ],
  },
  {
    input: [[0, 1, 1]],
    output: [],
  },
  {
    input: [[0, 1, 2]],
    output: [],
  },
  {
    input: [[0, 0, 0]],
    output: [[0, 0, 0]],
  },
]

TestCaseRunner(solutions, testcase)
