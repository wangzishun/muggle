import assert from 'node:assert'
import { test, describe, it } from 'node:test'

import { _flatten } from './index.mjs'

describe(_flatten.name, () => {
  it(() => {
    const input = {
      a: 1,
      b: [1, 2, { c: true }, [3]],
      d: { e: 2, f: 3 },
      g: null,
      h: undefined,
    }
    const output = _flatten(input)

    assert.deepStrictEqual(output, {
      a: 1,
      'b[0]': 1,
      'b[1]': 2,
      'b[2].c': true,
      'b[3][0]': 3,
      'd.e': 2,
      'd.f': 3,
    })
  })

  it(() => {
    const input = { a: { b: { c: 1, d: 2 }, e: 3 }, f: { g: 2 } }
    const output = _flatten(input)

    assert.deepStrictEqual(output, {
      'a.b.c': 1,
      'a.b.d': 2,
      'a.e': 3,
      'f.g': 2,
    })
  })
})
