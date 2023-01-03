import { TestCaseRunner } from '../../shared/test-case-runner.mjs'

import * as solutions from './index.mjs'

const testcase = [
  {
    input: ['babad'],
    output: 'bab',
  },
  {
    input: ['cbbd'],
    output: 'bb',
  },
  {
    input: ['a'],
    output: 'a',
  },
  {
    input: ['ac'],
    output: 'a',
  },
  {
    input: ['bb'],
    output: 'bb',
  },
  {
    input: ['123454321'],
    output: '123454321',
  },
  {
    input: ['12344321'],
    output: '12344321',
  },
  {
    input: ['12344321a'],
    output: '12344321',
  },
]

TestCaseRunner(solutions, testcase)
