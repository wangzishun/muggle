import { ListNode } from '../../shared/data-structure.mjs'
import { TestCaseRunner } from '../../shared/test-case-runner.mjs'

import * as solutions from './index.mjs'

const testcase = [
  {
    input: [ListNode.fromArray([1, 1, 2])],
    output: ListNode.fromArray([1, 2]),
  },
  {
    input: [ListNode.fromArray([1, 1, 2, 3, 3])],
    output: ListNode.fromArray([1, 2, 3]),
  },
  {
    input: [null],
    output: null,
  },
  {
    input: [ListNode.fromArray([1])],
    output: ListNode.fromArray([1]),
  },
  {
    input: [ListNode.fromArray([1, 1])],
    output: ListNode.fromArray([1]),
  },
  {
    input: [ListNode.fromArray([1, 1, 1, 2, 3, 4, 4, 4, 4, 4, 5])],
    output: ListNode.fromArray([1, 2, 3, 4, 5]),
  },
]

TestCaseRunner(solutions, testcase)
