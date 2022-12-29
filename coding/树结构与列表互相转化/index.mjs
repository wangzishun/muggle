export const _treeify = (list, key = 'id', parentKey = 'parentId') => {
  const mapping = new Map()

  list.forEach((element) => {
    mapping.set(element[key], element)
  })

  const root = []

  list.forEach((element) => {
    const parent = mapping.get(element[parentKey])

    if (parent) {
      parent.children = parent.children?.concat(element) || [element]
    } else {
      root.push(element)
    }
  })

  return root
}

export const _listify = (tree, childrenKey = 'children') => {
  const list = []

  const stack = [...tree]

  while (stack.length) {
    const node = stack.shift()
    if (node[childrenKey]) {
      stack.push(...node[childrenKey])
    }

    delete node[childrenKey]

    list.push(node)
  }

  return list
}
