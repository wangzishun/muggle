import { TestCaseRunner } from '../../shared/test-case-runner.mjs'

import * as solution from './index.mjs'

const testCases = [
  {
    input: ['abcde', ['a', 'bb', 'acd', 'ace']],
    output: 3,
  },
  {
    input: ['dsahjpjauf', ['ahjpjau', 'ja', 'ahbwzgqnuk', 'tnmlanowax']],
    output: 2,
  },
  {
    input: ['gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggq', ['gq', 'gq', 'gq', 'gq', 'gq', 'gq', 'gq', 'gq', 'gqwangzi']],
    output: 8,
  },
]

TestCaseRunner(solution, testCases)
