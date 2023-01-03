import { TreeNode } from '../../shared/data-structure.mjs'
import { TestCaseRunner } from '../../shared/test-case-runner.mjs'

import * as solutions from './index.mjs'

const testcase = [
  {
    input: [TreeNode.fromArray([1, 2, 3, 4, 5])],
    output: 3,
  },
  {
    input: [TreeNode.fromArray([1, 2])],
    output: 1,
  },
  {
    input: [TreeNode.fromArray([1, 2, 3, 4, 5, 6, 7])],
    output: 4,
  },
]

TestCaseRunner(solutions, testcase)
