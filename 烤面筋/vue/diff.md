# 双端 diff

双端 Diff 算法指的是，在新旧两组子节点的四个断点分别进行比较，并试图找到可复用的节点。
在双端比较中，每一轮比较都分为四个步骤。

第一步：比较旧的一组子节点中的第一个子节点 p-1 与新的一组子节点中的第一个子节点 p-4，看看它们是否相同。由于两者的 key 值不同，因此不相同，不可复用，于是怎么都不做。
第二步：比较旧的一组子节点中的最后一个子节点 p-4 与新的一组子节点中的最后一个子节点 p-3 ，看看它们是否相同。由于两者的 key 值不同，因此不相同，不可复用，于是什么都不做。
第三步：比较旧的一组子节点中的第一个子节点 p-1 与新的一组子节点中的最后一个子节点 p-3，看看它们是否相同。由于两者的 key 值不同，因此不相同，不可复用，于是什么都不做。
第四步：比较旧的一组子节点中的最后一个子节点 p-4 与新的一组子节点中的第一个子节点 p-4。由于它们的 key 值相同，因此可以进行 DOM 复用。

旧头新头
旧尾新尾
旧头新尾
旧尾新头

```js
function patchKeyedChildren(n1, n2, container) {
  const oldChildren = n1.children
  const newChildren = n2.children

  let oldStartIdx = 0
  let oldEndIdx = oldChildren.length - 1
  let newStartIdx = 0
  let newEndIdx = newChildren.length - 1

  let oldStartVNode = oldChildren[oldStartIdx]
  let oldEndVNode = oldChildren[oldEndIdx]
  let newStartVNode = newChildren[newStartIdx]
  let newEndVNode = newChildren[newEndIdx]

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 增加两个判断分支，如果头尾部节点为 undefined，说明该节点已经被处理过，直接跳到下一个位置
    if (!oldStartVNode) {
      oldStartVNode = oldChildren[++oldStartIdx]
    } else if (!oldEndVNode) {
      oldEndVNode = newChildren[--oldEndIdx]
    } else if (oldStartVNode.key === newStartVNode.key) {
      // 第一步：oldStartVNode 和 newStartVNode 比较
    } else if (oldEndVNode.key === newEndVNode.key) {
      // 第二步：oldEndVNode 和 newEndVNode 比较
    } else if (oldStartVNode.key === newEndVNode.key) {
      // 第三步：oldStartVNode 和 newEndVNode 比较
    } else if (oldEndVNode.key === newStartVNode.key) {
      // 第四步：oldEndVNode 和 newStartVNode 比较
    } else {
      // 乱序比较

      // 遍历旧的一组子节点，寻找与 newStartVNode 拥有相同 key 值的节点
      // idxInOld 就是新的一组子节点的头部节点在旧的一组子节点中的索引
      const idxInOld = oldChildren.findIndex((node) => node.key === newStartVNode.key)

      // idxInOld 大于 0，说明找到了可复用的节点，并且需要将其对应的真实 DOM 移动到头部
      if (idxInOld > 0) {
        // idxInOld 位置对应的 vnode 就是需要移动的节点
        const vnodeToMove = oldChildren[idxInOld]
        // 打补丁操作
        patch(vnodeToMove, newStartVNode, container)
        // 将 vnodeToMove.el 移动到头部节点 oldStartVNode.el 之前，因此使用后者作为锚点
        insert(vnodeToMove.el, container, oldStartVNode.el)
        // 由于位置 idxInOld 处的节点所对应的真实 DOM 已经移动到别处，因此将其设置为 undefined
        oldChildren[idxInOld] = undefined
      } else {
        // 将 newStartVNode 作为新节点挂载到头部，使用当前头部节点 oldStartVNode.el 作为锚点
        patch(null, newStartVNode, container, oldStartVNode.el)
      }

      // 更新 newStartIdx 到下一个位置
      newStartVNode = newChildren[++newStartIdx]
    }
  }

  // 循环结束检查索引值的情况
  if (oldEndIdx < oldStartIdx && newStartIdx <= newEndIdx) {
    // 如果满足条件，则说明有新的节点遗漏，需要挂载它们
    for (let i = newStartIdx; i <= newEndIdx; i++) {
      patch(null, newChildren[i], container, oldStartVNode.el)
    }
  } else if (newEndIdx < newStartIdx && oldStartIdx <= oldEndIdx) {
    // 移除操作
    for (let i = oldStartIdx; i <= oldEndIdx; i++) {
      unmount(oldChildren[i])
    }
  }
}
```

# 快速 Diff 算法

1. 使用 while 循环查找所有相同的前置节点，并调用 patch 函数进行打补丁，直到遇到 key 值不同的节点为止; 下一步需要处理相同的后置节点。由于两组新旧子节点的数量可能不同，所以我们需要两个索引 newEnd 和 oldEnd，分别指向新旧两组子节点中的最后一个节点
2. 在开启一个 while 循环，并从后向前遍历这两组子节点，知道遇到 key 值不同的节点为止；在 while 循环内，需要调用 patch 函数进行打补丁，然后递减两个索引 oldEnd、newEnd 的值。
3. 情况一：在预处理过程中，所有旧节点都处理完毕了；新节点应该插入
4. 情况二：在预处理过程中，所有新节点都处理完毕了；旧节点应该删除
5. 非理想情况下，就需要判断哪些节点需要移动，以及应该如何移动。核心是根据节点的索引关系，构造出一个最长递增子序列。序列中的节点就是不需要移动的节点。
   1. 新建一个数组 source，用来存储新的一组子节点中的节点在旧的一组子节点中的位置索引，后面将会使用它计算出一个最长递增子序列，并用于辅助完成 DOM 移动的操作.
   2. 第一个 for 循环用来构建索引表，索引表存储的是节点的 key 值与节点在新的一组子节点中位置索引之间的映射，
   3. 第二个 for 循环用来遍历旧的一组子节点。可以看到，我们拿旧子节点的 key 值去索引表 keyIndex 中查找该节点在新的一组子节点中的位置，并将查找结果存储到变量 k 中。如果 k 存在，说明该节点是可复用的，所以我们调用 patch 函数进行打补丁，并填充 source 数组。否则说明该节点已经不存在与新的一组子节点中，这时我们需要调用 unmount 函数卸载它。

```js
function patchKeyedChildren(n1, n2, container) {
  const newChildren = n2.children
  const oldChildren = n1.children

  // 更新相同的前置节点
  // 索引 j 指向新旧两组子节点的开头
  let j = 0
  let oldVNode = oldChildren[j]
  let newVNode = newChildren[j]
  // while 循环向后遍历，直到遇到拥有不同 key 值的节点为止
  while (oldVNode.key === newVNode.key) {
    // 调用 patch 函数进行更新
    patch(oldVNode, newVNode, container)
    // 更新索引 j，让其递增
    j++
    oldVNode = oldChildren[j]
    newVNode = newChildren[j]
  }

  // 更新相同的后置节点
  // 索引 oldEnd 指向旧的一组子节点的最后一个节点
  let oldEnd = oldChildren.length - 1
  // 索引 newEnd 指向新的一组子节点的最后一个节点
  let newEnd = newChildren.length - 1

  oldVNode = oldChildren[oldEnd]
  newVNode = newChildren[newEnd]

  // while 循环从后向前遍历，直到遇到拥有不同的 key 值的节点为止
  while (oldVNode.key === newVNode.key) {
    // 调用 patch 函数进行更新
    patch(oldVNode, newVNode, container)
    // 递减 oldEnd 和 newEnd
    oldEnd--
    newEnd--
    oldVNode = oldChildren[oldEnd]
    newVNode = newChildren[newEnd]
  }

  if (j > oldEnd && j <= newEnd) {
    // 预处理完毕后，如果满足如下条件，则说明 j --> nextEnd 之间的节点应作为新节点插入
    // 锚点的索引
    const anchorIndex = newEnd + 1
    // 锚点元素
    const anchor = anchorIndex < newChildren.length ? newChildren[anchorIndex].el : null
    // 采用 while 循环，调用 patch 函数逐个挂载新增节点
    while (j <= newEnd) {
      patch(null, newChildren[j++], container, anchor)
    }
  } else if (j > newEnd && j <= oldEnd) {
    // j --> oldEnd 之间的节点应该被卸载
    while (j <= oldEnd) {
      unmount(oldChildren[j++])
    }
  } else {
  }
}
```
