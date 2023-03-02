export function simpleAsyncGeneratorBasedControlFlow(generatorFunc) {
  const iterator = generatorFunc()

  return new Promise((resolve, reject) => {
    next()

    function next(data) {
      try {
        const { value, done } = iterator.next(data)
        if (done) {
          return resolve(value)
        }

        Promise.resolve(value).then(next, reject)
      } catch (error) {
        return reject(error)
      }
    }
  })
}

/**
 * 测试
 */
import assert from 'node:assert'
import { test, describe, it } from 'node:test'

describe('simpleAsyncGeneratorBasedControlFlow', () => {
  it('fetch rick and morty', async () => {
    const result = await simpleAsyncGeneratorBasedControlFlow(function* () {
      const response = yield fetch('https://rickandmortyapi.com/api')
      const data = yield response.json()

      return data
    })

    assert.equal('characters' in result, true)
  })

  it('sleepReturnWaiting', async () => {
    const sleepReturnWaiting = (waiting) => new Promise((resolve) => setTimeout(() => resolve(waiting), waiting))

    const result = await simpleAsyncGeneratorBasedControlFlow(function* () {
      const a = yield sleepReturnWaiting(300)
      const b = yield sleepReturnWaiting(200)
      const c = yield Promise.resolve(500)

      return a + b + c
    })

    assert.equal(result, 1000)
  })

  it('catch error', async () => {
    const ErrorString = 'ERROR STRING'
    try {
      await simpleAsyncGeneratorBasedControlFlow(function* () {
        const a = yield Promise.resolve(1)
        // throw new Error('error')
        yield Promise.reject(new Error(ErrorString))

        const b = yield Promise.resolve(2)

        return a + b + c
      })
    } catch (error) {
      assert.equal(error.message, ErrorString)
    }
  })
})
