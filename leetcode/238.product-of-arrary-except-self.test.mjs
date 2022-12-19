import { runner } from './0.utils.mjs'

import * as solutions from './238.product-of-arrary-except-self.mjs'

const testcase = [
  {
    input: [[1, 2, 3, 4]],
    output: [24, 12, 8, 6],
  },
  {
    input: [[-1, 1, 0, -3, 3]],
    output: [0, 0, 9, 0, 0],
  },
  {
    input: [[1, 0]],
    output: [0, 1],
  },
  {
    input: [[1, 2, 3, 4, 5]],
    output: [120, 60, 40, 30, 24],
  },
  {
    input: [[1, 2, 3, 4, 5, 6]],
    output: [720, 360, 240, 180, 144, 120],
  }
]

runner(solutions, testcase)
