# react18 的架构

Scheduler 调度器, 实现时间切片、任务调度。
Reconciler 协调器, 将任务交给调度器进行调度, 从 根节点开始遍历 fiber 树, 对需要操作的 fiber 打上标记, 又称为 render 阶段。
Renderer 渲染器, 对打了标记的 fiber 节点进行操作, 又称为 commit 阶段。

react 的整个工作主要分两大阶段 render 和 commit, render 又分两个主要过程 beginWork、completeWork, commit 阶段有三个标记性阶段 beforeMutation、mutation、layout。

# render 阶段

# react hooks 是怎么实现的

# react fiber 的理解, fiber 解决了什么问题

1. 作为架构来说, fiber 节点之间通过 return、child、sibling 三个属性连接成一棵树, 在 render 阶段中通过这三个属性进行 fiber 树的遍历；
2. fiber 还用来描述一个节点的具体信息, 节点可以是 FunctionComponent\ClassComponet\HostComponent\Context；
3. fiber 还是实现时间切片的最小任务单元, 在 render 阶段中每次进行一个 fiber 的 beginWork 之后都会判断是否还有剩余时间片；
4. fiber 还保存了组件的状态、要执行操作的标记、优先级相关的信息 lanes、childLanes

# react fiber 双缓存机制

react 中同时最多有两颗 fiber 树, current fiber 和 正在构建中的 workInProgress fiber, 通过 alternate 来链接。

双缓存的作用主要有两个：1.尝试 baiout 复用 fiber； 2.通过 current fiber 和 jsx element 进行 diff 对比生成新 fiber。

react 在首次 mount 时会创建全局唯一的 FiberRootNode 用来保存一些全局变量, 其中 FiberRootNode.current 指向 rootFiber, 也就是组件树的根节点。接下来进入 render 阶段, 通过组件返回的 jsx element 创建新的 WIF fiber, 在 commit 阶段渲染到页面中, 然后修改 fiberRootNode.current 指向, 使 WIF fiber 变成 current fiber。
在 update 时会重新进行 render 并构建一棵新的 WIF fiber, 构建的过程中会尝试直接 biaout 复用或者将 current fiber 与 jsx element 进行 diff 算法来复用节点数据。在 commit 阶段修改 current 指针使 WIF fiber 变成 current fiber。

# react 如何快速响应

# key 的作用

作为每一个虚拟节点的唯一 ID, 可以依靠 key 更快更准的拿到旧节点中可复用的那个节点.

1. 用 key:

   - 维持组件的状态, 保证组件的复用
   - diff 算法的过程中需要去查找能够复用的节点, 有 key 的时候, 通过 map 进行可复用节点的查找, 提升查找性能.
   - 节点复用带来的性能提升, 降低创建/删除节点的操作

2. 不用 key：
   - 就地复用节点. 只会在节点的属性层面上进行比较和更新. 所以可能在某种程度上会有渲染性能上的提升
   - 无法维持组件的状态. 过渡动画效果、表单状态

在实际的应用场景里, 我的理解是只有在重新排序的场景下才有优化的可能. 在一般的简单列表的渲染场景下, 不加 key 反而能达到 dom 节点就地复用的效果, 只需要修改 DOM 文本内容而不是移除/添加节点, 某种程度上会有渲染性能的提升. 如果无脑加 key 的话, 某些场景下, 如果每次更新都不能找到可复用节点, 那么就需要在 DOM 里添加/移除节点.

当然这都是我的经验之谈, 总的来说, 在数据稳定的时候, 节点可以复用, 加 key 能提高性能; 对于频繁更新的数据, 节点不能复用, 这个时候不加 key 能够达到 dom 就地复用的效果, 但可能产生一些问题, 无法维持组件的状态, 产生问题的场景下需要带上 key.

性能提升有多方面的影响, diff 算法的效率, DOM 节点增删移动的次数, 数据的量级, 都会影响最终的结果.

# react16, 为什么并没有使用 React 的情况下, 也需要在文件顶部 import React from 'react'

编译 jsx 后的需要使用 React.createElement

- react17 后, jsx 转化插件 @babel/plugin-transform-react-jsx 会在打包的时候自动添加

# 为什么 setState 是异步的

[RFClarification: why is setState asynchronous?](https://github.com/facebook/react/issues/11527#issuecomment-360199710)

- 保持内部一致性：props 的更新是异步的, 因为 re-render 父组件的时候, 传入子组件的 props 才变化；为了保持数据一致, state\props\refs, state 也不直接更新, 都是在 flush 的时候更新
- 将 state 的更新延缓到最后批量合并再去渲染对于应用的性能优化是有好处的, 如果每次的状态改变都去重新渲染真实 DONM, 那么它将带来巨大的性能消耗
- 立即更新回来视觉上的不适应, 比如在页面打开时候, 多个请求发布导致频繁更改 Loading 状态, 会导致 Loading 图标闪烁

之前的版本是有 isBatchingUpdates 锁的概念, react17 中没有这个变量, 当 render / 合成事件触发时都会改变 executionContext 的值, 只要绕开 react 内部触发更改 executionContext 的逻辑, 就能保证 executionContext 为 NoContext, 进而让 ensureRootIsScheduled 中去调用 flushSyncCallbackQueue\performanceSyncWorkOnRoot, 进行同步渲染. setState 的“异步”并不是说内部由异步代码实现, 其实本身执行的过程和代码都是同步的, 只是合成事件和钩子函数的调用顺序在 setState 执行之前, 导致 setState 后 class 组件没法立马拿到更新后的值, 函数式组件拿不到是因为闭包导致的, 除了 ref 无论怎样都拿不到.

react17 legacy 模式下或者之前的版本, 如果不是在事件回调和钩子函数中执行的 setState, 想要批量更新的话, 可以使用 ReactDOM.unstable_batchedupdates.
对于 react18 来说, 默认启用批量更新, 如果想要同步效果的话, 可以使用 ReactDOM.flushSync, 把更新任务放在一个较高的优先级中
