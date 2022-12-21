import { TestCaseRunner } from '../../shared/test-case-runner.mjs'

import * as solutions from './index.mjs'

const testcase = [
  {
    input: [
      ['ExamRoom', 'seat', 'seat', 'seat', 'seat', 'leave', 'seat'],
      [[10], [], [], [], [], [4], []],
    ],
    output: [null, 0, 9, 4, 2, null, 5],
  },

  JSON.parse(
    `{
      "input":[
        ["ExamRoom","seat","seat","seat","leave","leave","seat","seat","seat","seat","seat","seat","seat","seat","seat","leave","leave","seat","seat","leave","seat","leave","seat","leave","seat","leave","seat","leave","leave","seat","seat","leave","leave","seat","seat","leave"],
        [[10],       [],    [],    [],    [0],    [4],    [],    [],    [],    [],    [],    [],    [],    [],    [],    [0],    [4],    [],    [],    [7],    [],    [3],    [],    [3],    [],    [9],    [],    [0],    [8],    [],    [],    [0],    [8],    [],    [],    [2]]
      ],
      "output":[
        null,0,9,4,null,null,0,4,2,6,1,3,5,7,8,null,null,0,4,null,7,null,3,null,3,null,9,null,null,0,8,null,null,0,8,null
      ]
    }
    `,
  ),
]
/**
 * 需要包装一下才能处理 ExamRoom 类的实例化和方法调用
 */
const solutionsWrapper = (solutions) => {
  const wrappered = {}

  for (let [version, solution] of Object.entries(solutions)) {
    /** 真正的测试执行 */
    wrappered[version] = (methods, args) => {
      let instance = null

      // 返回执行结果
      const result = []

      for (let index in methods) {
        const method = methods[index]
        const arg = args[index]

        if (method === 'ExamRoom') {
          instance = new solution(...arg)
          result.push(null)
        } else {
          result.push(instance[method](...arg))
        }
      }

      return result
    }
  }

  return wrappered
}

TestCaseRunner(solutionsWrapper(solutions), testcase)
