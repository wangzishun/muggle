import { TreeNode } from '../../shared/data-structure.mjs'
import { TestCaseRunner } from '../../shared/test-case-runner.mjs'

import * as solutions from './index.mjs'

const testcase = [
  {
    input: [TreeNode.fromArray([1, null, 2, 3])],
    output: [1, 2, 3],
  },
  {
    input: [TreeNode.fromArray([])],
    output: [],
  },
  {
    input: [TreeNode.fromArray([1])],
    output: [1],
  },
  {
    input: [TreeNode.fromArray([1, 2])],
    output: [1, 2],
  },
  {
    input: [TreeNode.fromArray([1, null, 2])],
    output: [1, 2],
  },
  {
    input: [TreeNode.fromArray([1, 2, 3, 4, 5, 6, 7])],
    output: [1, 2, 4, 5, 3, 6, 7],
  },
  {
    input: [TreeNode.fromArray([1, 4, 3, 2])],
    output: [1, 4, 2, 3],
  },
]

TestCaseRunner(solutions, testcase)
