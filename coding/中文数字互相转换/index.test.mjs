import assert from 'node:assert'
import { test, describe, it } from 'node:test'

import { _number2Chinese, _chinese2Number } from './index.mjs'

describe(_number2Chinese.name, () => {
  it(() => {
    assert.equal(_number2Chinese(1), '一')
  })

  it(() => {
    assert.equal(_number2Chinese(1234), '一千二百三十四')
  })

  it(() => {
    assert.equal(_number2Chinese(123456), '十二万三千四百五十六')
  })

  it(() => {
    assert.equal(_number2Chinese(12345670), '一千二百三十四万五千六百七十')
  })

  it(() => {
    assert.equal(_number2Chinese(100010001), '一亿零一万零一')
  })

  it(() => {
    assert.equal(_number2Chinese(10100010001), '一百零一亿零一万零一')
  })
})

describe(_chinese2Number.name, () => {
  it(() => {
    assert.equal(_chinese2Number('一'), 1)
  })

  it(() => {
    assert.equal(_chinese2Number('一千二百三十四'), 1234)
  })

  it(() => {
    assert.equal(_chinese2Number('十二万三千四百五十六'), 123456)
  })

  it(() => {
    assert.equal(_chinese2Number('一千二百三十四万五千六百七十'), 12345670)
  })

  it(() => {
    assert.equal(_chinese2Number('一亿零一万零一'), 100010001)
  })

  it(() => {
    assert.equal(_chinese2Number('一百零一亿零一万零一'), 10100010001)
  })

  // it(() => {
  //   assert.equal(BigInt(_chinese2Number('十一兆零一千亿一千万一千零一')), BigInt(11000000100010001))
  // })

  // it(() => {
  //   assert.equal(BigInt(_chinese2Number('十一兆')), n11000000000000000)
  // })
})
