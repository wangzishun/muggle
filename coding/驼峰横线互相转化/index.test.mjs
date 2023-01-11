import assert from 'node:assert'
import { test, describe, it } from 'node:test'
import {
  _camelCase2KebabCase,
  _kebabCase2CamelCase,
  _kebabCase2CamelCaseByArray,
  _kebabCase2PascalCase,
} from './index.mjs'

describe(_camelCase2KebabCase.name, () => {
  it(() => {
    const res = _camelCase2KebabCase('helloWorld')
    assert.strictEqual(res, 'hello-world')
  })

  it(() => {
    const res = _camelCase2KebabCase('helloWorldHelloWorld')
    assert.strictEqual(res, 'hello-world-hello-world')
  })

  it(() => {
    const res = _camelCase2KebabCase('wangZiShun')
    assert.strictEqual(res, 'wang-zi-shun')
  })
})

describe(_kebabCase2CamelCase.name, () => {
  it(() => {
    const res = _kebabCase2CamelCase('hello-world')
    assert.strictEqual(res, 'helloWorld')
  })

  it(() => {
    const res = _kebabCase2CamelCase('hello-world-hello-world')
    assert.strictEqual(res, 'helloWorldHelloWorld')
  })

  it(() => {
    const res = _kebabCase2CamelCase('wang-zi-shun')
    assert.strictEqual(res, 'wangZiShun')
  })

  it(() => {
    const res = _kebabCase2CamelCase('wang-zi-shun-2-hallo')
    assert.strictEqual(res, 'wangZiShun2Hallo')
  })
})

describe(_kebabCase2CamelCaseByArray.name, () => {
  it(() => {
    const res = _kebabCase2CamelCase('hello-world')
    assert.strictEqual(res, 'helloWorld')
  })

  it(() => {
    const res = _kebabCase2CamelCase('hello-world-hello-world')
    assert.strictEqual(res, 'helloWorldHelloWorld')
  })

  it(() => {
    const res = _kebabCase2CamelCase('wang-zi-shun')
    assert.strictEqual(res, 'wangZiShun')
  })

  it(() => {
    const res = _kebabCase2CamelCase('wang-zi-shun-2-hallo')
    assert.strictEqual(res, 'wangZiShun2Hallo')
  })
})

describe(_kebabCase2PascalCase.name, () => {
  it(() => {
    const res = _kebabCase2PascalCase('hello-world')
    assert.strictEqual(res, 'HelloWorld')
  })

  it(() => {
    const res = _kebabCase2PascalCase('hello-world-hello-world')
    assert.strictEqual(res, 'HelloWorldHelloWorld')
  })

  it(() => {
    const res = _kebabCase2PascalCase('wang-zi-shun')
    assert.strictEqual(res, 'WangZiShun')
  })

  it(() => {
    const res = _kebabCase2PascalCase('wang-zi-shun-2-hallo')
    assert.strictEqual(res, 'WangZiShun2Hallo')
  })
})
