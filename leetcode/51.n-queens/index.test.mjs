import assert from 'node:assert'
import { test, describe, it } from 'node:test'

import { ListNode, TreeNode } from '../../shared/data-structure.mjs'

import { TestCaseRunner } from '../../shared/test-case-runner.mjs'

import * as solutions from './index.mjs'

const testcase = [
  {
    input: [1],
    output: [
      [
        'Q', // Solution 1
      ],
    ],
  },
  {
    input: [2],
    output: [],
  },
  {
    input: [3],
    output: [],
  },
  {
    input: [4],
    output: [
      [
        '.Q..', // Solution 1
        '...Q',
        'Q...',
        '..Q.',
      ],
      [
        '..Q.', // Solution 2
        'Q...',
        '...Q',
        '.Q..',
      ],
    ],
  },
  {
    input: [5],
    output: [
      [
        'Q....', // Solution 1
        '..Q..',
        '....Q',
        '.Q...',
        '...Q.',
      ],
      [
        'Q....', // Solution 2
        '...Q.',
        '.Q...',
        '....Q',
        '..Q..',
      ],
      [
        '.Q...', // Solution 3
        '...Q.',
        'Q....',
        '..Q..',
        '....Q',
      ],
      [
        '.Q...', // Solution 4
        '....Q',
        '..Q..',
        'Q....',
        '...Q.',
      ],
      [
        '..Q..', // Solution 5
        'Q....',
        '...Q.',
        '.Q...',
        '....Q',
      ],
      [
        '..Q..', // Solution 6
        '....Q',
        '.Q...',
        '...Q.',
        'Q....',
      ],
      [
        '...Q.', // Solution 7
        'Q....',
        '..Q..',
        '....Q',
        '.Q...',
      ],
      [
        '...Q.', // Solution 8
        '.Q...',
        '....Q',
        '..Q..',
        'Q....',
      ],
      [
        '....Q', // Solution 9
        '.Q...',
        '...Q.',
        'Q....',
        '..Q..',
      ],
      [
        '....Q', // Solution 10
        '..Q..',
        'Q....',
        '...Q.',
        '.Q...',
      ],
    ],
  },
]

TestCaseRunner(solutions, testcase)
