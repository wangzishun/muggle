import assert from 'node:assert'
import { test, describe, it } from 'node:test'

function resort(arr) {
  return arr.sort((a, b) => {
    const aLen = a.length
    const bLen = b.length
    const len = Math.min(aLen, bLen)

    for (let i = 0; i < len; i++) {
      const aCode = a.charCodeAt(i)
      const bCode = b.charCodeAt(i)
      if (aCode === bCode) {
        continue
      }
      if (aCode >= 48 && aCode <= 57) {
        if (bCode >= 48 && bCode <= 57) {
          // a b 都是数字
          return aCode - bCode
        }
        // a 是数字，b 不是数字, 字母优先
        return -1
      }
      // a 不是数字，b 是数字, 字母优先
      if (bCode >= 48 && bCode <= 57) {
        return 1
      }

      // a b 都不是数字
      return aCode - bCode
    }
    return aLen - bLen
  })
}

test(() => {
  // 这个过不了，没找到规律
  const input = ['C1B100A', 'C1B90B10']
  const output = ['C1B90B10', 'C1B100A']

  const result = resort(input)
  console.log(result)
  assert.deepEqual(result, output)
})

test(() => {
  const input = ['D12A', 'D12', 'B', 'CX', 'B1', 'D12B', 'C1B100A', 'C1B90B10', 'B0']
  const output = ['B', 'B0', 'B1', 'C1B90B10', 'C1B100A', 'CX', 'D12', 'D12A', 'D12B']

  const result = resort(input)
  console.log(result)
  assert.deepEqual(result, output)
})
