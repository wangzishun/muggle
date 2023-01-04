
import assert from 'node:assert'
import { test, describe, it } from 'node:test'

import { ListNode, TreeNode } from '../../shared/data-structure.mjs'

import { TestCaseRunner } from '../../shared/test-case-runner.mjs'

import * as solutions from './index.mjs'

const testcase = [
  {
    input: [],
    output: null,
  },
]

TestCaseRunner(solutions, testcase)
