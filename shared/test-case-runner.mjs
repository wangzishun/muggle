/**
 * 测试
 */
import assert from 'node:assert'
import { test, describe, it } from 'node:test'

/**
 * 解决方案可以有多个版本，遍历每个版本的解决方案是否能够通过测试用例
 *
 * 负责执行测试用例，检查 input 的输出结果是否全等于指定的 output
 *
 * @param {*} solutions { version: solution function }
 * @param {*} testcase { input: [], output: [] }
 */
export const TestCaseRunner = (solutions, testcase) => {
  for (let [version, solution] of Object.entries(solutions)) {
    describe(version, () => {
      for (let index in testcase) {
        const { input, output, debug } = testcase[index]
        it(`case index ${index}`, async () => {
          if (debug) {
            debugger
            solution(...input)
          }

          const reuslt = await solution(...input)
          assert.deepEqual(reuslt, output)
        })
      }
    })
  }
}
