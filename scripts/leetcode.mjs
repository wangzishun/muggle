#! /usr/bin/env node
/**
 * 用来生成 leetcode 题目模板文件
 */

console.info('leetcode script run')

import fs from 'node:fs'
import path from 'node:path'

const requestProblem = async () => {
  const [, , leetcodeProblemsUrlOrTitleSlug] = process.argv

  /**
   * 解析 url 获取 titleSlug
   * from: https://leetcode.cn/problems/n-queens/
   * to: n-queens
   */
  const titleSlug = leetcodeProblemsUrlOrTitleSlug.split('/').findLast((item) => item)

  console.info('fetching problem: ', titleSlug)

  const response = await fetch('https://leetcode-cn.com/graphql/', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      operationName: 'questionData',
      variables: { titleSlug },
      query: `
              query questionData($titleSlug: String!) {\n
                question(titleSlug: $titleSlug) {\n
                  questionId\n
                  questionFrontendId\n
                  boundTopicId\n
                  title\n
                  titleSlug\n
                  translatedTitle\n
                }\n
              }\n
              `,
    }),
  })

  const { data } = await response.json()
  return data
}

const getIndexFileTemplate = ({ description, see }) => `
import { ListNode, TreeNode } from '../../shared/data-structure.mjs'

/**
 * @description ${description}
 * @see ${see}
 */
`

const getTestFileTemplate = () => `
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
`

const createProblemFile = async (problem) => {
  const { questionId, translatedTitle, titleSlug } = problem.question
  const dirPath = path.resolve(`./leetcode/${questionId}.${titleSlug}`)
  const indexFile = path.resolve(dirPath, 'index.mjs')
  const testFile = path.resolve(dirPath, 'index.test.mjs')

  fs.mkdirSync(dirPath, { recursive: true })
  fs.writeFileSync(
    indexFile,
    getIndexFileTemplate({ description: `${questionId}.${titleSlug} ${translatedTitle}`, see: `https://leetcode-cn.com/problems/${titleSlug}/` }),
  )
  fs.writeFileSync(testFile, getTestFileTemplate())
}

requestProblem().then(createProblemFile)
