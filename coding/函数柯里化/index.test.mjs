/**
 * 测试
 */
import assert from 'node:assert'
import { test, describe, it } from 'node:test'

import { _curry, _curryAddV1, _curryAddV2 } from './index.mjs'

describe(_curry.name, () => {
  it(async () => {
    function multiFn(a, b, c) {
      return a * b * c
    }
    var multi = _curry(multiFn)

    const result = [multi(2)(3)(4), multi(2, 3, 4), multi(2)(3, 4), multi(2, 3)(4)]

    assert.deepEqual(result, [24, 24, 24, 24])
  })

  it(async () => {
    function multiFn(a, b, c, d) {
      return a + b + c + d
    }
    var multi = _curry(multiFn)

    const result = [multi(2)(3)(4)(5), multi(2, 3, 4, 5), multi(2)(3, 4)(5), multi(2, 3)(4)(5), multi(2)(3)(4, 5)]

    assert.deepEqual(result, [14, 14, 14, 14, 14])
  })
})

describe(_curryAddV1.name, () => {
  it(async () => {
    const result = [_curryAddV1(1), _curryAddV1(1)(2), _curryAddV1(1)(2)(3), _curryAddV1(1)(2, 3), _curryAddV1(1, 2)(3), _curryAddV1(1, 2, 3)]

    assert.deepEqual(result, [1, 3, 6, 6, 6, 6])
  })

  it(async () => {
    const result = [_curryAddV1(2)(3)(4)(5), _curryAddV1(2, 3, 4, 5), _curryAddV1(2)(3, 4)(5), _curryAddV1(2, 3)(4)(5), _curryAddV1(2)(3)(4, 5)]

    assert.deepEqual(result, [14, 14, 14, 14, 14])
  })
})

describe(_curryAddV2.name, () => {
  it(async () => {
    const result = [_curryAddV2(1), _curryAddV2(1)(2), _curryAddV2(1)(2)(3), _curryAddV2(1)(2, 3), _curryAddV2(1, 2)(3), _curryAddV2(1, 2, 3)]

    assert.deepEqual(result, [1, 3, 6, 6, 6, 6])
  })

  it(async () => {
    const result = [_curryAddV2(2)(3)(4)(5), _curryAddV2(2, 3, 4, 5), _curryAddV2(2)(3, 4)(5), _curryAddV2(2, 3)(4)(5), _curryAddV2(2)(3)(4, 5)]

    assert.deepEqual(result, [14, 14, 14, 14, 14])
  })
})
