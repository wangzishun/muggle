import { TestCaseRunner } from '../../shared/test-case-runner.mjs'

import * as solutions from './index.mjs'

const testcase = [
  {
    input: [['h', 'e', 'l', 'l', 'o']],
    output: ['o', 'l', 'l', 'e', 'h'],
  },
  {
    input: [['H', 'a', 'n', 'n', 'a', 'h']],
    output: ['h', 'a', 'n', 'n', 'a', 'H'],
  },
  {
    input: [['a', 'b', 'c', 'd']],
    output: ['d', 'c', 'b', 'a'],
  },
]

TestCaseRunner(solutions, testcase)
