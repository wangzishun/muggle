import assert from 'node:assert'
import { test, describe, it } from 'node:test'

import { _treeify, _listify } from './index.mjs'

const testcase1 = Object.freeze({
  list: [
    {
      id: 1,
      text: '节点1',
      parentId: 0,
    },
    {
      id: 2,
      text: '节点1_1',
      parentId: 1,
    },
    {
      id: 3,
      text: '节点1_2',
      parentId: 1,
    },
    {
      id: 4,
      text: '节点1_1_1',
      parentId: 2,
    },
    {
      id: 5,
      text: '节点1_2_1',
      parentId: 3,
    },
  ],
  tree: [
    {
      id: 1,
      text: '节点1',
      parentId: 0,
      children: [
        {
          id: 2,
          text: '节点1_1',
          parentId: 1,
          children: [
            {
              id: 4,
              text: '节点1_1_1',
              parentId: 2,
            },
          ],
        },
        {
          id: 3,
          text: '节点1_2',
          parentId: 1,
          children: [
            {
              id: 5,
              text: '节点1_2_1',
              parentId: 3,
            },
          ],
        },
      ],
    },
  ],
})

const deepClone = (obj) => JSON.parse(JSON.stringify(obj))

describe(_treeify.name, () => {
  it(() => {
    const case1 = deepClone(testcase1)
    assert.deepStrictEqual(_treeify(case1.list), case1.tree)
  })
})

describe(_listify.name, () => {
  it(() => {
    const case1 = deepClone(testcase1)

    assert.deepStrictEqual(_listify(case1.tree), case1.list)
  })
})

// describe(_listify.name + _treeify.name, () => {
//   it(() => {
//     assert.deepStrictEqual(_treeify(_listify(testcase1.tree)), testcase1.list)
//     assert.deepStrictEqual(_listify(_treeify(testcase1.list)), testcase1.tree)
//   })
// })
