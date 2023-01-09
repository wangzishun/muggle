import { TreeNode } from './shared/data-structure.mjs'

const defaultOptions = { cancel: () => {} }

const abortify = (func) => {
  let controller = null
  let lastCaller = defaultOptions

  return function (...args) {
    lastCaller.cancel()
    controller = new AbortController()

    return new Promise((resolve, reject) => {
      const handler = () => {
        reject(new Error('[abortify] aborted'))
      }
      controller.signal.addEventListener('abort', handler)

      lastCaller = {
        cancel: () => {
          controller.abort()
          controller.signal.removeEventListener('abort', handler)
        },
      }

      Promise.resolve(func.apply(this, args)).then(resolve, reject)
    }).finally(() => {
      lastCaller = defaultOptions
    })
  }
}

const test = async (xxx) => {
  await new Promise((resolve) => setTimeout(() => resolve(xxx), 1000))
  return 'test' + xxx
}

const abortifyV3 = (func) => {
  let cancelLastCaller = null

  return function (...args) {
    cancelLastCaller?.()

    return new Promise((resolve, reject) => {
      cancelLastCaller = () => {
        reject('[abortify] aborted')
      }

      Promise.resolve(func.apply(this, args)).then(resolve, reject)
    }).finally(() => {
      cancelLastCaller = null
    })
  }
}

const sum = (tree) => {
  const result = []

  const path = []
  const travel = (node) => {
    // 到达叶子节点的左右子节点时，什么都不做
    if (!node) {
      return
    }

    path.push(node.val)

    // 到达叶子节点，左右子节点都为空
    if (!node.left && !node.right) {
      result.push(+path.join(''))
      path.pop()

      return
    }

    travel(node.left)
    travel(node.right)

    path.pop()
  }

  travel(tree)
  return result
}

console.log(sum(TreeNode.fromArray([1, 2, 3, null, null, 4, 5])))
