// node 18
import assert from 'node:assert'
import { test, describe, it } from 'node:test'

function getTarget(data, keys) {
  // 对每行进行遍历，同时填充结果对象
  const targetData = data.values.reduce((acc, row) => {
    // const [data1, key2, data2, key1, data3, data4] = row
    // const dataList = row.filter((i) => typeof i === 'number')
    const keyList = row.filter((i) => typeof i === 'string')

    // 按 key 构造路径，同时返回路径的尽头
    const end = keyList.reduce((temp, key) => {
      if (!temp[key]) temp[key] = {}
      return temp[key]
    }, acc)

    data.columns.forEach((col, index) => {
      if (col.startsWith('data')) {
        end[col] = row[index]
      }
    })

    return acc
  }, {})

  console.log(JSON.stringify(targetData, null, 2))

  try {
    // 构造函数，根据路径取值
    const getByPath = new Function('o', `return o["${keys.join('"]["')}"];`)
    return getByPath(targetData)
  } catch {
    return undefined
  }
}

test(() => {
  const data = {
    columns: ['data1', 'key2', 'data2', 'key1', 'data3', 'data4'],
    values: [
      [1, 'k12', 1, 'k11', 1, 1],
      [2, 'k12', 2, 'k21', 2, 2],
      [3, 'k22', 3, 'k31', 3, 3],
    ],
  }

  const targetData = {
    k12: {
      k11: {
        data1: 1,
        data2: 1,
        data3: 1,
        data4: 1,
      },
      k21: {
        data1: 2,
        data2: 2,
        data3: 2,
        data4: 2,
      },
    },
    k22: {
      k31: {
        data1: 3,
        data2: 3,
        data3: 3,
        data4: 3,
      },
    },
  }

  assert.deepEqual(getTarget(data, ['k12', 'k11']), targetData.k12.k11)
})
