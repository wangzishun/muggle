# Context 原理

Context 的实现思路总体分为 2 步.
在消费状态时,ContextConsumer 节点调用 readContext(MyContext)获取最新状态.
在更新状态时, 由 ContextProvider 节点负责查找所有 ContextConsumer 节点, 并设置消费节点的父路径上所有节点的 fiber.childLanes, 保证消费节点可以得到更新.

在 createContext 返回的对象中包含 provider 和 consumer，都是 ReactElement 对象，因为闭包的原因都可以直接访问到 value， 并且在 consumer 的 fiber 节点的 dependency 上拼接上当前 context

createContext 核心逻辑: 其初始值保存在 context.currentValue(同时保存到 context.currentValue2. 英文注释已经解释, 保存 2 个 value 是为了支持多个渲染器并发渲染)
同时创建了 Provider, Consumer， 2 个 reactElement 对象.

在渲染过程中会针对 Provider 节点进行处理，同样也分 mount 和 update 两种情况，update 时 beginWork 方法里会向下查找需要更新的节点，也就是所有 fiber.dependencies 依赖该 context 的节点，然后从这些节点向上遍历, 修改父路径上所有节点的 fiber.childLanes 属性, 标记有更新, 从而避免递归过程中被 renderLanes 剪枝，强迫子节点进入更新逻辑。另外一个点是在 beginWork 进行压栈 completeWork 进行出栈，这样可以保证按嵌套顺序进行访问 Context。

Context 的消费有两种方式，一种是通过 useContext，另一种是通过 Consumer 组件，这两种方式的实现原理是一样的，都是通过 readContext 方法来获取当前 context 的值，然后将 Context 保存在 fiber.dependencies 上

当 context 发生更新时， 会从 Provider 节点开始往下查找子节点中 dependency 上有当前 context 的 fiber 节点， 然后从当前节点开始向上回溯到 rootfiber， 在回溯的过程中收集经过的父节点的 lane 更新优先级，最后通过调度算法执行相应的更新，重新进入 render&commit 阶段，完成视图的更新
