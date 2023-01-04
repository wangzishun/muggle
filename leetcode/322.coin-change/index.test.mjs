import { TestCaseRunner } from '../../shared/test-case-runner.mjs'

import * as solutions from './index.mjs'

const testcase = [
  {
    input: [[1, 2, 5], 11],
    output: 3,
  },
  {
    input: [[2], 3],
    output: -1,
  },
  {
    input: [[1], 0],
    output: 0,
  },
  {
    input: [[1], 1],
    output: 1,
  },
  {
    input: [[1], 2],
    output: 2,
  },
  {
    input: [[1, 2, 5, 10, 20, 50, 100, 200], 1000],
    output: 5,
  },
]

TestCaseRunner(solutions, testcase)
