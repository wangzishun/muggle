function Node(name, value, state, children) {
  this.name = name
  this.value = value
  this.children = children
  this.state = state
}

// state 0 未选中 1 选中，2 半选中
function handleNodes(data, node, state) {
  // 先处理后代节点
  node?.children?.forEach((child) => {
    handleNodes(data, child, state)
  })

  node.state = state

  const isCurrentNode = (target) => target === node

  const stack = [] // 保存从根节点到当前节点的路径上的所有节点
  const findPath = (target, data) => {
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      if (isCurrentNode(item)) {
        return true
      }
      if (item.children) {
        stack.push(item)
        if (findPath(target, item.children)) {
          return true
        }
        stack.pop()
      }
    }
  }

  findPath(node, data)

  // 再挨个遍历一把
  stack.forEach((node) => {
    const { children } = node

    const childStates = children.map((child) => child.state)
    if (childStates.every((s) => s === 0)) {
      node.state = 0
    } else if (childStates.every((s) => s === 1)) {
      node.state = 1
    } else {
      node.state = 2
    }
  })
}
