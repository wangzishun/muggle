const arr = [
  {
    id: 0,
    data: 1,
  },
  {
    pid: 0,
    id: 1,
    data: 2,
  },
  {
    pid: 0,
    id: 2,
    data: 3,
  },
  {
    pid: 2,
    id: 3,
    data: 4,
  },
  {
    pid: 3,
    id: 4,
    data: 5,
  },
]

const toTree = (arr, key = 'id', parentKey = 'pid') => {
  const map = new Map()

  arr.forEach((item) => map.set(item[key], item))

  const result = []

  arr.forEach((item) => {
    const parent = map.get(item[parentKey])

    if (parent) {
      parent.children?.push(item) || (parent.children = [item])
    } else {
      result.push(item)
    }
  })

  return result
}

console.log(JSON.stringify(toTree(arr), null, 2))
