/**
 * 测试
 */
import assert from 'node:assert'
import { test, describe, it } from 'node:test'

export const runner = (solutions, testcase) => {
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
