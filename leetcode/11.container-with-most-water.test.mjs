import { runner } from './0.utils.mjs'

import * as solutions from './11.container-with-most-water.mjs'

const testcase = [
  {
    input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]],
    output: 49,
  },
  {
    input: [[1, 1]],
    output: 1,
  },
  {
    input: [[4, 3, 2, 1, 4]],
    output: 16,
  },
  {
    input: [[1, 2, 1]],
    output: 2,
  },
]

runner(solutions, testcase)
