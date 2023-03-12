import assert from 'node:assert'
import { test, describe, it } from 'node:test'

const testcase = [
  {
    input: [['abc', 'aba', 'ac'], 'ba'],
    output: ['aba'],
  },
  {
    input: [['abc', 'aba', 'ca'], 'ac'],
    output: ['abc'],
  },
  {
    input: [['abc', 'aba', 'aac'], 'aa'],
    output: ['aba', 'aac'],
  },
  {
    input: [['abc', 'ab', 'ac'], ''],
    output: [],
  },
]

function getVal(data, key) {
  if (key === '') {
    return []
  }
  return data.filter((str) => {
    let i = 0
    let j = 0
    const strLen = str.length
    const keyLen = key.length

    while (i < keyLen && j < strLen) {
      if (key[i] === str[j]) i++
      j++
    }
    return i === keyLen
  })
}

testcase.map((tc) => {
  const { input, output } = tc
  test(() => {
    const result = getVal(...input)
    console.log(result)
    assert.deepEqual(result, output)
  })
})
