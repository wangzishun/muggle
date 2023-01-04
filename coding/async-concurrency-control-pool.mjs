/**
 * 异步并发控制
 *
 * @param {*} limit
 * @param {*} paramsList
 * @param {*} asyncFuncs
 */
export const asyncConcurrencyControlPoolV1 = async (limit, paramsList, func) => {
  const tasks = []
  const executingTasks = []

  for (let index = 0; index < paramsList.length; index++) {
    const params = paramsList[index]

    const task = Promise.resolve().then(() => func(params, index, paramsList))
    tasks[index] = task

    const executingTask = task.finally(() => executingTasks.splice(executingTasks.indexOf(executingTask), 1))
    executingTasks.push(executingTask)

    if (executingTasks.length >= limit) {
      await Promise.race(executingTasks)
    }
  }

  return Promise.all(tasks)
}

export const asyncConcurrencyControlPoolV2 = async (limit, paramsList, func) => {
  const tasks = []
  const executingTasks = []

  const enqueue = async (index = 0) => {
    if (index >= paramsList.length) {
      return Promise.resolve()
    }

    const params = paramsList[index]

    const task = Promise.resolve().then(() => func(params, index, paramsList))
    tasks.push(task)

    const executingTask = task.finally(() => executingTasks.splice(executingTasks.indexOf(executingTask), 1))
    executingTasks.push(executingTask)

    if (executingTasks.length >= limit) {
      await Promise.race(executingTasks)
    }

    return enqueue(index + 1)
  }

  return enqueue().finally(() => Promise.all(tasks))
}

/**
 * 测试
 */
import assert from 'node:assert'
import { test, describe, it } from 'node:test'

const asyncFuncs = async (params, index) => {
  console.time(`task: ${index}`)
  console.timeLog(`task: ${index}`)
  await new Promise((resolve) => setTimeout(resolve, params * 1000))
  console.timeEnd(`task: ${index}`)
  return params
}

const limit = 3
const paramsList = [10, 2, 5, 5, 5, 5, 2]
const expiredTime = 12 * 1000

describe('asyncConcurrencyControlPoolV1', () => {
  it('v1', async () => {
    const start = Date.now()

    const result = await asyncConcurrencyControlPoolV1(limit, paramsList, asyncFuncs)

    const duration = Date.now() - start
    assert.ok(duration > expiredTime && duration < expiredTime + 1000)

    assert.deepEqual(result, paramsList)
  })
})

describe('asyncConcurrencyControlPoolV2', () => {
  it('v2', async () => {
    const start = Date.now()

    const result = await asyncConcurrencyControlPoolV2(limit, paramsList, asyncFuncs)

    const duration = Date.now() - start
    assert.ok(duration > expiredTime && duration < expiredTime + 1000)

    assert.deepEqual(result, paramsList)
  })
})
