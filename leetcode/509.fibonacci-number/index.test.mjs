import { TestCaseRunner } from '../../shared/test-case-runner.mjs'

import * as solutions from './index.mjs'

const testcase = [
  {
    input: [0],
    output: 0,
  },
  {
    input: [1],
    output: 1,
  },
  {
    input: [2],
    output: 1,
  },
  {
    input: [3],
    output: 2,
  },
  {
    input: [4],
    output: 3,
  },
  {
    input: [5],
    output: 5,
  },
  {
    input: [6],
    output: 8,
  },
  {
    input: [7],
    output: 13,
  },
  {
    input: [8],
    output: 21,
  },
  {
    input: [9],
    output: 34,
  },
  {
    input: [10],
    output: 55,
  },
  {
    input: [11],
    output: 89,
  },
  {
    input: [12],
    output: 144,
  },
  {
    input: [13],
    output: 233,
  },
]

TestCaseRunner(solutions, testcase)
