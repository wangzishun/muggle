# react18 的架构

Scheduler 调度器，实现时间切片、任务调度。
Reconciler 协调器，将任务交给调度器进行调度，从 根节点开始遍历 fiber 树，对需要操作的 fiber 打上标记，又称为 render 阶段。
Renderer 渲染器，对打了标记的 fiber 节点进行操作，又称为 commit 阶段。

react 的整个工作主要分两大阶段 render 和 commit，render 又分两个主要过程 beginWork、completeWork，commit 阶段有三个标记性阶段 beforeMutation、mutation、layout。

# render 阶段

# react hooks 是怎么实现的

# react fiber 的理解，fiber 解决了什么问题

1. 作为架构来说，fiber 节点之间通过 return、child、sibling 三个属性连接成一棵树，在 render 阶段中通过这三个属性进行 fiber 树的遍历；
2. fiber 还用来描述一个节点的具体信息，节点可以是 FunctionComponent\ClassComponet\HostComponent\Context；
3. fiber 还是实现时间切片的最小任务单元，在 render 阶段中每次进行一个 fiber 的 beginWork 之后都会判断是否还有剩余时间片；
4. fiber 还保存了组件的状态、要执行操作的标记、优先级相关的信息 lanes、childLanes

# react fiber 双缓存机制

react 中同时最多有两颗 fiber 树，current fiber 和 正在构建中的 workInProgress fiber，通过 alternate 来链接。

双缓存的作用主要有两个：1.尝试 baiout 复用 fiber； 2.通过 current fiber 和 jsx element 进行 diff 对比生成新 fiber。

react 在首次 mount 时会创建全局唯一的 FiberRootNode 用来保存一些全局变量，其中 FiberRootNode.current 指向 rootFiber，也就是组件树的根节点。接下来进入 render 阶段，通过组件返回的 jsx element 创建新的 WIF fiber，在 commit 阶段渲染到页面中，然后修改 fiberRootNode.current 指向，使 WIF fiber 变成 current fiber。
在 update 时会重新进行 render 并构建一棵新的 WIF fiber，构建的过程中会尝试直接 biaout 复用或者将 current fiber 与 jsx element 进行 diff 算法来复用节点数据。在 commit 阶段修改 current 指针使 WIF fiber 变成 current fiber。

# react 如何快速响应
