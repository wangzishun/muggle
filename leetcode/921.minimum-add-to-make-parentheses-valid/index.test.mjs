import { TestCaseRunner } from '../../shared/test-case-runner.mjs'

import * as solutions from './index.mjs'

const testcase = [
  {
    input: ['())'],
    output: 1,
  },
  {
    input: ['((('],
    output: 3,
  },
  {
    input: ['()'],
    output: 0,
  },
  {
    input: ['()))(('],
    output: 4,
  },
  {
    input: ['((()))'],
    output: 0,
  },
  {
    input: ['((())'],
    output: 1,
  },
  {
    input: ['((())('],
    output: 2,
  },
]

TestCaseRunner(solutions, testcase)
