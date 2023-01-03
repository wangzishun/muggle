import { TreeNode } from '../../shared/data-structure.mjs'
import { TestCaseRunner } from '../../shared/test-case-runner.mjs'

import * as solutions from './index.mjs'

const testcase = [
  {
    input: [TreeNode.fromArray([3, 9, 20, null, null, 15, 7])],
    output: 3,
  },
  {
    input: [TreeNode.fromArray([1, null, 2])],
    output: 2,
  },
  {
    input: [TreeNode.fromArray([])],
    output: 0,
  },
  {
    input: [TreeNode.fromArray([0])],
    output: 1,
  },
]

TestCaseRunner(solutions, testcase)
