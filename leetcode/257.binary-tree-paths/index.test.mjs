import assert from 'node:assert'
import { test, describe, it } from 'node:test'

import { ListNode, TreeNode } from '../../shared/data-structure.mjs'

import { TestCaseRunner } from '../../shared/test-case-runner.mjs'

import * as solutions from './index.mjs'

const testcase = [
  {
    input: [TreeNode.fromArray([1, 2, 3, null, 5])],
    output: ['1->2->5', '1->3'],
  },
  {
    input: [TreeNode.fromArray([1])],
    output: ['1'],
  },
  {
    input: [TreeNode.fromArray([1, 2, 3, null, null, 4, 5])],
    output: ['1->2', '1->3->4', '1->3->5'],
  },
]

TestCaseRunner(solutions, testcase)
