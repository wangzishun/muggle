- [react 的架构](#react-的架构)
- [react 如何快速响应](#react-如何快速响应)
- [fiber 的理解, fiber 解决了什么问题](#fiber-的理解-fiber-解决了什么问题)
- [fiber 双缓存机制](#fiber-双缓存机制)
- [React 优先级？](#react-优先级)
- [什么是并发模式？](#什么是并发模式)
- [更新是怎么样的流程，遇到一个高优先级的事件， 怎么中断的？](#更新是怎么样的流程遇到一个高优先级的事件-怎么中断的)
- [react 调度原理？react 时间切片是怎么实现的？](#react-调度原理react-时间切片是怎么实现的)
- [MessageChannel 是什么？settimeout 或者 requestanimationframe？](#messagechannel-是什么settimeout-或者-requestanimationframe)
- [渲染过程](#渲染过程)
- [diff 算法](#diff-算法)
- [key 的作用](#key-的作用)
- [react 生命周期](#react-生命周期)
- [为什么要引入 hooks](#为什么要引入-hooks)
- [useReducer/useState 的实现](#usereducerusestate-的实现)
- [useLayoutEffect/useEffect 的实现](#uselayouteffectuseeffect-的实现)
- [useSyncExternalStore](#usesyncexternalstore)
- [react16, 为什么需要在文件顶部 import React from 'react'](#react16-为什么需要在文件顶部-import-react-from-react)
- [为什么 setState 是异步的](#为什么-setstate-是异步的)
- [Context 原理](#context-原理)
- [合成事件](#合成事件)
- [server component](#server-component)
- [react 18 api](#react-18-api)

# react 的架构

Scheduler 调度器, 实现时间切片、任务调度。
Reconciler 协调器, 将任务交给调度器进行调度, 从 根节点开始遍历 fiber 树, 对需要操作的 fiber 打上标记, 又称为 render 阶段。
Renderer 渲染器, 对打了标记的 fiber 节点进行操作, 又称为 commit 阶段。

react 的整个工作主要分两大阶段 render 和 commit, render 又分两个主要过程 beginWork、completeWork, commit 阶段有三个标记性阶段 beforeMutation、mutation、layout。
react 是声明式 UI 库，负责将 State 转换为 fiber 结构后，再转换成真实 DOM 结构，交给浏览器渲染。当 State 发生改变时，React 会先进行调和（Reconciliation）阶段，调和阶段结束后立刻进入提交（Commit）阶段，提交阶段结束后，新 State 对应的页面才被展示出来。

# react 如何快速响应

对我们程序猿来说，提高程序的响应速度一般分为两个方向，一个是解决 cpu 密集计算，避免 cpu 瓶颈，另一个是解决 IO 密集问题，提高 IO 速度。
第一个 cpu 密集计算问题。JS 可以操作 DOM，GUI 渲染线程与 JS 线程是互斥的。所以 JS 脚本执行和浏览器布局、绘制不能同时执行。假设每秒 60 赫兹那么意味着一秒钟被分成了 60 份，在每 16.6ms 时间内，需要完成 JS 脚本执行 > 样式布局 > 样式绘制，如果想要达到比较流畅的体验那么在一帧的时间里 JS 脚本的执行时间不能太久。 react 的方案是基于 fiber 架构的时间切片。
在 IO 问题上方面，浏览器的 IO 瓶颈主要在网络请求上，react 提供了 suspense useDeferredValue useTransition 这些 api 进行优化。也是基于 fiber 架构进行 scheduler 优先级调度实现的。

# fiber 的理解, fiber 解决了什么问题

1. 作为架构来说, fiber 节点之间通过 return、child、sibling 三个属性连接成一棵树, 在 render 阶段中通过这三个属性进行 fiber 树的遍历；
2. fiber 还用来描述一个节点的具体信息, 节点可以是 FunctionComponent\ClassComponet\HostComponent\Context；
3. fiber 还是实现时间切片的最小任务单元, 在 render 阶段中每次进行一个 fiber 的 beginWork 之后都会判断是否还有剩余时间片；
4. fiber 还保存了组件的状态、要执行操作的标记、优先级相关的信息 lanes、childLanes

   fiber: tag key type stateNode return child sibling index ref pendingProps memoizedProps updateQueue memoizedState dependencies lanes childLanes alternate

   jsx: $$typeof type, key, ref, props, \_source, \_owner

# fiber 双缓存机制

react 中同时最多有两颗 fiber 树, current fiber 和 正在构建中的 workInProgress fiber, 通过 alternate 来链接。currentFiber.alternate === workInProgressFiber; workInProgressFiber.alternate === currentFiber;
双缓存的作用主要有两个：1.尝试 baiout 复用 fiber； 2.通过 current fiber 和 jsx element 进行 diff 对比生成新 fiber。

react 在首次 mount 时会创建整个应用的根结点 FiberRootNode 用来保存一些全局变量, 其中 FiberRootNode.current 指向 rootFiber, 也就是组件树的根节点。接下来进入 render 阶段, 通过组件 jsx 返回的 reactelement 创建新的 WIF fiber,因为是第一次 mount 所以没有能用复用的节点，然后在 commit 阶段渲染到页面中, 修改 fiberRootNode.current 指向, 使 WIF fiber 变成 current fiber。
在 update 时会重新进行 render 并构建一棵新的 WIF fiber, 构建的过程中会尝试直接 biaout 复用或者将 current fiber 与 jsx element 进行 diff 算法来复用节点数据。在 commit 阶段修改 current 指针让新的 WIF fiber 变成 current fiber。

# React 优先级？

react 中优先级有 lane 模型和 schedulerPriority 调度优先级, 另外还有一种是 reactPriorityLevel 用于将 lane 转换为 schedulerPriority。

其中，lane 模型是一个 31 位的二进制数，位数越低优先级越高。lane 优先级是从合成事件中获取的，然后放到 update 对象上，传递给 fiber 节点，在 completeWork 回溯的过程中收集到 root 节点上。

react 在进行调度更新的时候，会从 root 节点中计算出本次更新的 renderLanes, 然后将 lanes 转成 schedulerPriority，调用 scheduleCallback 方法将优先级传递给 scheduler，进行本次渲染任务的调度。

如果有渲染正在被调度执行， 这时再次触发一次更新的话，也就是调用 ensureRootIsScheduled 方法，会重新计算 renderLanes，如果和上一次优先级完全一样，那么不需要重新发起调度，如果不同，意味着本次优先级更高。会将正在执行的任务取消（将 task.callback 置为 null， 在调用 scheduleCallback 时会返回新建的 task,并存放在 fiberRoot.callbackNode 上； 虽然 scheduler 内部维护了 task 的优先级队列， 但是队列中属于渲染流程的只有一个， 其他都是 effectTask）。

# 什么是并发模式？

并发模式按照官方来说，就是能够让应用保持快速响应的一个概念。我的理解是， 要实现 concurrent 模式，最关键的点是实现异步可中断的更新。

react fiber 架构的意义在于单个 fiber 不仅是虚拟节点，也是 render 过程中的最小工作单元，让 react 能够以 fiber 为粒度进行任务的可中断执行。react 还通过 scheduler 进行时间切片，每处理一个 fiber 节点都会去判断时间是否用尽。从而实现异步可中断更新。除此之外，还有一个优先级的概念，react 有一个 lane 模型来控制不同优先级更新的行为，使得高优先级更新可以打断低优先级的 render 过程。

所以我认为 concurrent 是一套可以控制的，具有多个优先级的更新机制。基于 concurrent 模式，react 实现了许多功能，比如批量更新（之前脱离了 react 上下文的 setstate 不会被合并，现在是基于优先级对更新进行合并）、suspense、useTransition、useDeferredValue 等

# 更新是怎么样的流程，遇到一个高优先级的事件， 怎么中断的？

比如在 input 中输入字符，在回调中 setstate, 我们会拿到一个更新的合成事件，合成事件中可以得到一个优先级的 lane,并创建 update 对象，放到对应的 hook.queue.pending 上，然后从当前 fiber 向上回溯知道根节点，将更新途径的父节点的 childlane 最终收集到根节点上， 这个方法叫 markUpdateLaneFromFiberToRoot，之后再调用 ensureRootIsScheduled 方法，这里会根据 root 上所有需要更新的 lanes 计算出本次更新的 renderLanes，同时会和正在调度执行的渲染优先级进行对比，完全一样就不需要重新发起调度，如果不同那么意味着本次优先级更高。会将正在执行的任务取消（将 task.callback 置为 null， 在调用 scheduleCallback 时会返回新建的 task,并存放在 fiberRoot.callbackNode 上； 虽然 scheduler 内部维护了 task 的优先级队列， 但是队列中属于渲染流程的只有一个， 其他都是 effectTask）

ensureRootIsScheduled 里面通过 scheduler 去调度 performanceConcurrentWorkOnRoot, 会新建一个 task 加入优先级队列等待调度，当 scheduler 内部进行调度的时候会用一个 while 循环来执行优先级队列中的 task.callback, 但每个 task 在具体执行之前都要进行超时检测, 如果超时立即退出循环并等待下一个时间片。对于一次渲染任务来说他的 task.callback 其实就是 performanceConcurrentWorkOnRoot，执行的时候也会有一个循环 workloop performanceUnitOfWork, 对每个 fiber 进行 begin work 和 completework。

虽然 scheduler 自己实现了时间切片, 但如果单个 task.callback 执行时间很长，就需要 task.callback 自己能够检测是否超时, 所以在 fiber 树构造过程中, 每构造完成一个单元, 都会通过 shouldYield 检测是否超时, 如遇超时就退出 workloop fiber 树构造循环, 结束掉 performanceConcurrentWorkOnRoot，在 performanceConcurrentWorkOnRoot 函数的结尾会返回自己的一个 bind 方法，这个 return 的 bind 方法对于 scheduler 来说代表着 task 未完成，会将它赋值给 task.callback(就是此处的 continuationCallback)，并等待下一次时间片到来时继续执行，也就是重新执行 performanceConcurrentWorkOnRoot，又因为全局变量(WIF)没有发生改变，所以 performUnitOfWork 会从上次退出的地方继续执行，直到整个 fiber 树构造完成。

# react 调度原理？react 时间切片是怎么实现的？

这里面有几个关键词 messagechannel 优先级队列（小顶堆） task deadline

scheduler 通过 scheduleCallback 来创建 task 并加入队列，task 上有 callback\priorityLevel\priorityLevel\expirationTime，然后通过 MessageChannel 触发宏任务，宏任务执行开始的时候会根据当前时间计算出 5ms 之后的 deadline 时间。接下来会通过循环不断的将堆顶的 task 取出并执行 callback；因为一个时间片可能会执行多个 task，所以执行之前会判断是否还有剩余时间，当然 task 上也有过期时间如果过期的话也会继续执行。

为了避免一个 task 的执行时间过久，scheduler 还对外提供了 shouldYield 方法把控制权交给外面，外面可以通过 shouldYield 来中断工作避免长时间占用线程。如果返回的是一个函数，那么这个函数就是一个 continuationCallback，会在下一个时间片继续执行任务。

# MessageChannel 是什么？settimeout 或者 requestanimationframe？

messageChannel 能建立通信管道，并通过两端的端口（port1 和 port2）发送消息。属于异步的宏任务。new messageChannel 拿到两个端口，通过 postMessage 发送消息，通过 onmessage 接收消息。

在一次事件循环中，会从事件队列中挑选出一个宏任务去执行，事件队列有多个，比如定时器、网络请求、i/o、domEvent 等， settimeout 设置 0 的话，持续调用或递归调用会导致间隔时间会变成 4 毫秒，造成浪费。

requestanimationframe 的话需要浏览器判断需要更新页面时才会执行回调，否则不执行。也就是说更新事件不确定，raf 的回调中再执行 raf， 第二个 raf 会放到下一帧，与需求也不太符合。多轮事件循环可能不会触发渲染，但是 raf 中嵌套 raf,那么内部的 raf 会在下一帧执行，这是宏任务与 raf 之间最大的区别。

requestIdleCallback 存在兼容性问题，并且触发时机不稳定。它通常用来处理不重要不紧急的任务。不符合需求。是在浏览器空闲时执行的回调，如果浏览器一直在执行任务，那么回调就不会执行。如果浏览器空闲时间很长，那么回调会被执行多次。

# 渲染过程

- 渲染过程分为两个阶段，render 和 commit，分别对应 Reconciler 和 Renderer。render 阶段是根据 state 生成对应的 fiber 结构，commit 阶段是根据 fiber 结构生成真实 DOM 结构

- react 更新有两种，分别是同步更新和并发更新(performSyncWorkOnRoot，performConcurrentWorkOnRoot)，这两个都会通过 scheduler 进行调度，然后进入一个 while 循环去执行 performUnitOfWork，不同点在于 concurrent 会在循环中额外判断 shouleYield，是否还有剩余时间片。没有剩余时间就会会中止循环，直到浏览器有空闲时间后再继续遍历。

- performUnitOfWork 会创建下一个 Fiber 节点把他和已创建的节点连起来构成 fiber 树结构。赋值给 workInProgress 变量。里面主要是调用 beginWork 和 completeWork 两个方法。整个 render 阶段是先从上倒下遍历，为每个节点执行 beginWork，然后再从下往上回溯执行 completeWork，都说 render 阶段是可中断的，但其实可中断的只有 beginWork，completeWork 是不可中断的。

- beginWork 里面会根据 tag 的不同创建子 fiber 节点，但如果满足一定条件会直接复用 current 节点(bailoutOnAlreadyFinishedWork 条件有两个，一个是是新旧 props 相同并且 type 类型相同，第二个是 current fiber 的更新优先级不够，includesSomeLane(renderLanes, updateLanes))；不满足优化路径的时候就会根据 tag 新建子 fiber 节点，比如 function 组件是执行这个函数返回 jsx ReactElement， 然后进入 reconcileChildren 将 element 转换成 fiber 节点并赋值给 workInProgress.child，这个过程会应用到 react diff 算法。

- 调和过程 reconcileChildren 会针对 mount 和 update 进行不同的处理，唯一的区别是：reconcileChildFibers 会为生成的 Fiber 带上 effectTag(flags) 属性，而 mountChildFibers 不会。在 mount 时只有 rootFiber 会赋值 Placement effectTag(flags)，在 commit 阶段只会执行一次插入操作。因为在 mount 的时候只有 rootFiber 的 current 不为空，所以只有 rootFiber 会进入 reconcileChildFibers，而其他节点都会进入 mountChildFibers。

- completeWork 也是根据 tag 进行不同类型组件的处理，不过他们都有一个共同的特点，就是会进行属性冒泡 bubbleProperties，目的是把 lanes/flags 收集到父节点上，方便在 commit 阶段进行剪枝优化。 最重要的一个操作就是针对 HostComponent 创建 dom 节点，同样也分 mount 和 update。
  mount 时为 Fiber 节点生成对应的 DOM 节点，并插入子节点。因为这个阶段是沿着 return 属性从下到上遍历，所以是子节点先创建，等到父节点创建的时候需要插入子节点。意味着在 mount 时 completeWork 到 rootFiber 时，已经有一个构建好的离屏 DOM 树。
  update 时会处理 onClick 这些事件，还有 style\children 这些属性，存放到 updateQueue 中，[prop, key]， 等到 commit 阶段再进行更新。

- commint 阶段 主要是遍历 fiber 结构根据对应的 flags 标记，把更新应用到 DOM 中。这个过程又分为三部分。在 commint 一开始的时候会使用 scheduleCallback 调度执行 flushPassiveEffects(里面会访问 rootWithPendingPassiveEffects，这个变量是在 layout 之后才被赋值， useEffect 异步执行的原因主要是防止同步执行时阻塞浏览器渲染)

- before mutation 阶段（执行 DOM 操作前），有一个比较重要的是调用组件的 getSnapshotBeforeUpdate 生命周期函数。处理 DOM 节点渲染/删除后的 autoFocus、blur 逻辑。因为 Stack Reconciler 重构为 Fiber Reconciler 后，render 阶段的任务可能中断/重新开始，在 render 阶段的生命周期钩子（即 componentWillXXX）可能触发多次。所以提供了替代的生命周期钩子 getSnapshotBeforeUpdate，由于 commit 阶段是同步的，所以不会遇到多次调用的问题。

- mutation 阶段（执行 DOM 操作）递归遍历 fiber 节点，根据 subtreeFlags 进行递归剪枝。根据 ContentReset effectTag 重置文字节点、更新 ref、根据 flags 处理新增更新删除(Placement | Update | Deletion | Hydrating)
  插入操作：commitPlacement，获取父节点，再获取这个 fiber 节点的 dom 兄弟节点，来决定是 insertBefore 还是 appendChild。
  更新操作：commitWork，这里也会根据 tag 的进行不同的处理，比如 FunctionComponent 会进行 useLayoutEffect 的销毁；对于 HostComponent 来说会遍历 updateQueue 来设置 dom 节点的属性
  删除操作：递归调用 Fiber 节点，如果是 ClassComponent 那么会调用 componentWillUnmount 生命周期钩子，从页面移除 Fiber 节点对应 DOM 节点；解绑 ref；调度 useEffect 的销毁函数

- layout 阶段（执行 DOM 操作后）到了这里之后 JS 已经可以获取到新的 DOM，但是浏览器对新的 DOM 并没有完成渲染。这个阶段对于 functioncomp 来说主要是 useLayoutEffect 的执行，对于 classcomp 来说主要是 componentDidMount / componentDidUpdate 的执行。还有一个关键点是，获取 DOM 实例，更新 fiber.ref 属性

- 最后会修改 fiberRootNode.current 指针指向新的 fiberroot 节点，切换缓存树。最后会重新触发 ensureRootIsScheduled，然后进入下一次的 render 阶段

# diff 算法

- 思路是只对同级元素进行 Diff；两个不同类型的节点不能复用；通过 key 来保持节点的稳定。react 分别针对多节点和单节点进行 diff， diff 的对象是通过新生成的 ReactElement 数组和 上一次 commit 后的 current fiber 的子节点链表。无论是单节点还是多节点的比较, 都是为了生成子节点，并且(新增, 删除, 移动位置等)打上标记, 等待 commit 阶段再处理.

- 多节点对比的场景中主要有两次循环 reconcileChildFibers/reconcileChildrenIterator。
  O(n^3) 的大致由来： 两棵树嵌套循环寻找不同的节点：O(n^2)，寻找到不同的节点后，需要再遍历得到最小的转换消耗，最终得 到 O(n^3)

  1.  第一次循环: 遍历最长公共序列(key 相同), 公共序列的节点都视为可复用。
  2.  如果新的 element 节点都被遍历完, 那么 oldFiber 中剩余节点都要标记删除
  3.  但如果 oldFiber 节点被遍历完, 那么新的 element 节点都要标记新增
  4.  然后进行第二次循环，先将剩余的 oldFiber 转成 map 结构，然后遍历新的 element 节点，如果新的 element 节点的 key 在 map 中存在，那么就将这个节点标记为可复用，否则就标记为新增。最后将 map 中没用到的 fiber 标记为删除。

  我在学习源码的时候有一个小插曲，第一次循环的里面有一个 index 的比较，如果 oldFiber.index > newIdx 就会直接跳出这次循环，一开始我不知道他是干什么的，debug 了很多次也进不了这个判断分支。后来查 issure 发现这个判断是应对 falsy 元素的，就是 null、false 这种。因为 falsy 元素在数组中破坏了原来的顺序，导致按顺序比较 key 的最长公共序列的时候没有意义，所以直接跳出是合理的。

  还有一个比较有意思的点是通过 lastPlacedIndex 和新 index 进行对比得出是否发生移动 lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);

- 单节点 reconcileSingleElement

  在单节点的场景里，会先判断 key 是否相同，再判断 type 是否相同，只有都相同时才能复用。如果一个 fiber 有子节点当 child !== null 且 key 相同但是 type 不同时，会把这个节点和他之后的兄弟节点都标记删除，如果 key 不同那么就只会把这个节点标记删除。其他情况就是创建新的 fiber 并返回。

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

# react 生命周期

react 生命周期一般来说存在于 class 组件中，但是现在 hooks 组件中 useeffect 也可以等价于某些生命周期
constructor、getDerivedStateFromProps、render、componentDidMount、shouldComponentUpdate、getSnapshotBeforeUpdate、componentDidUpdate、componentWillUnmount

useEffect 可以等价于 componentDidMount/componentDidUpdate、componentWillUnmount

# 为什么要引入 hooks

这个问题官网上有很好的解释，当然作为开发者也对这个问题有一些自己的理解。

1. class 组件中，可能有很多逻辑相似的代码分布在不同的生命周期内，这样的代码逻辑不够纯洁，难以复用，不利于维护。拿一个简单的发布订阅来说，如果一个组件有多个订阅事件，class 中需要在 mount 的时候订阅，再 unmount 的时候取消订阅，这些事件交互就混在了一起的。但是 hook 的方式就很好的解决了这个问题，可以用一个 effect 来包裹一个订阅和取消，开发的关注点可以聚焦在具体的功能上。
2. class 组件中，还有 this 指向的问题，但其实还有一个 this 导致的隐形的性能问题。我们为了避免 this 问题，可能会用 bind 或者是箭头函数，这代表 class 组件的函数都不在原型链上，所以没办法共享，是虚假的面向对象，又因为 class 组件的实例会保存在 fiber.stateNode 上，所以这些箭头函数也会一定会占用更多的内存。
3. shouldeComponentUpdate/getSnapshotBeforeUpdate/getDerivedStateFromProps 这个三个 api 相对于 effect 来说真的不是特别好用，
4. 从打包体积的角度来说，class 经过 babel 编译相对于函数来说会多出很多代码

当然现在也不能完全的抛弃 class，ErrorBoundary 的场景还是需要写 class

# useReducer/useState 的实现

对于函数式组件来说，fiber 上使用 memoizedState 属性存放 hook 链表，每个 hook 节点上也有一个 memoizedState，对于不同的 hook 来说存储的数据不一样。

以 useReducer 为例，工作流程上，是需要先声明 useReducer 并返回 state 和 dispatch，这个过程是在 render/beginWork 阶段完成的，会把函数组件放到 renderWithHooks 里去执行，执行的过程中又分为 mount 和 update，mountWorkInProgressHook 时会创建 hook 并挂到 fiber 上。当我们调用 dispatch 的时候就会触发一次更新，创建 update 并加入到 hook.queue.pending 中，并开启调度 scheduleUpdateOnFiber。更新过程中会再次遍历到这个组件对应的 fiber 节点，执行 renderWithHooks，这个时候进入 hook 的更新过程 updateWorkInProgressHook，主要是从链表上按次序找到对应的 hook，然后运行 reducer 更新 hook 上的 memoizedState。

更新过程中有一个比较重要的点是： 一个 hook state 的值由多个 update 决定，也就是存在多个 update 更新，但是这些 update 的 lane 可能不在本次更新的 renderLanes 中，这些 update 会被跳过，但是为了保证数据计算的一致性，需要保留第一个被跳过的 update 之后的所有 update。

另外一个小优化是：dispatch 时会判断 hook 上是否存在 update，如果没有的话，就会提前计算出 eagerState。不需要等到 render 阶段再计算。这样做的好处是：如果计算出的 state 与该 hook 之前保存的 state 一致，那么完全不需要开启一次调度。即使计算出的 state 与该 hook 之前保存的 state 不一致，在声明阶段也可以直接使用调用阶段已经计算出的 state

useState 是基于 useReducer 实现的，的区别是，reducer 需要传入一个函数 lastRenderedReducer，useState 是默认内置了一个函数 basicStateReducer。

```ts
type Update<S, A> = {|
  lane: Lane,
  action: A,
  eagerReducer: ((S, A) => S) | null,
  eagerState: S | null,
  next: Update<S, A>,
  priority?: ReactPriorityLevel,
|};

type UpdateQueue<S, A> = {|
  pending: Update<S, A> | null,
  dispatch: (A => mixed) | null,
  lastRenderedReducer: ((S, A) => S) | null,
  lastRenderedState: S | null,
|};

export type Hook = {|
  memoizedState: any, // 当前状态
  baseState: any, // 基状态
  baseQueue: Update<any, any> | null, // 基队列
  queue: UpdateQueue<any, any> | null, // 更新队列
  next: Hook | null, // next指针
|};
```

useState/useReducer：memoizedState 保存 state 的值
useEffect：memoizedState 保存回调函数、依赖项等的链表数据结构 effect，effect 链表同时会保存在 fiber.updateQueue 中。
useRef：memoizedState 保存{current: 1}
useMemo：memoizedState 保存[callback(), depA]
useCallback：memoizedState 保存[callback, depA]。与 useMemo 的区别是，useCallback 保存的是 callback 函数本身，而 useMemo 保存的是 callback 函数的执行结果

# useLayoutEffect/useEffect 的实现

mount 的时候创建 hook，创建 effect(在 pushEffect 中), 挂载到 hook.memoizedState 上, 即 hook.memoizedState = effect，effect 也是一个单向环状链表，还会保存在 fiber.updateQueue 中。从数据结构来看，一个 effect 有 tag/create/destory/deps/next 组成。在 update 的时候会根据比较依赖是否变化来更新 effect，依赖不变的情况下也会新建 effect，只是不带 HasEffect 标记，不过他们都会继续用之前的 destory, 只有在 effect.create 重新执行的时候才会产生新的 destory。

这些 effect 会根据 tag 的不同在 commit 阶段被处理 Update/Passive 通过 scheduleCallback 调度 flushPassiveEffects。layoutEffect 会在 mutation 阶段执行 destory，在 layout 阶段执行 create。另外在组件被销毁的时候也会执行 effect.destory。

# useSyncExternalStore

如果用到了 useSyncExternalStore 这个 api，我研究他的时候发现再 commit 阶段还会再检查一次数据有没有被修改过。如果被修改过那么就会强制用同步模式去重新进行 render。

这个 api 接收三个参数，subscribe、getSnapshot、getServerSnapshot，其中 subscribe 是订阅函数，getSnapshot 是获取快照函数，getServerSnapshot 是获取服务端快照函数，另外他还有一个高级版本 useSyncExternalStoreWithSelector，额外接收 selector 和 equal 两个参数，就是从 getSnapshot 中获取的数据进行了一次选择，equal 就是自定义的对比。

和其他的 hook 一样也分为 mount 和 update，mount 的时候会 mountWorkInProgressHook, 执行 getSnapshot 并把结果赋值给 hook.memoizedState，hook.queue 上保存 state 和 getSnapshot， 然后通过 Effect 去执行 subscribe，并传入内部的更新钩子，这个时候我们外部的观察者就收集到了内部的更新钩子。当数据更新的时候我们需要自己去执行观察到的钩子函数来触发 react 的调度更新 forceStoreRerender。update 的时候会通过 updateWorkInProgressHook 拿到 hook，并且执行 getSnapshot，然后将 memoizedState 也就是上一次的快照进行对比，如果有变动那么久标记这个 fiber 接收到了更新。为了保证数据的一致性，react 在 commit 阶段还会再额外检查一下数据有没有被修改过，如果有的话还会再发起一次调度更新。这是因为 concurrent 模式的 render 过程中外部数据可能已经发生了改变，但是更新的优先级没有变，导致 scheduler 不会取消正在执行的任务，导致 render 过程中使用的数据与 store 中的真实数据有差异，为了保证数据的一致性，就只能在 render 之后的 commit 阶段再次检查。同步模式中如果是比较早的 effect 也可能会导致这个问题。这就是官网上反复提到的撕裂 tearing。

兼容处理是靠订阅和 forceUpdate 解决的。关键点在于那个 useLayoutEffect 部分，其中判断了外部状态的最新值与渲染的值（capture value）是否一致，不一致就强制更新（并且是同步的），最终效果仍是用户会最终得到一个一致的渲染结果（但中间还是会有 tearing，只是因为同步更新的原因，浏览器直到控制权交回后才会绘制 dom）

# react16, 为什么需要在文件顶部 import React from 'react'

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

# 合成事件

React 在启动时会创建全局对象, 其中在创建 fiberRoot 对象时，遍历所有的原生事件, 调用 listenToNativeEvent 监听冒泡和捕获阶段的事件，还会进行节流优化, 保证全局注册只被调用一次.

主要是不同的事件 domEventName 调用 getEventPriorityForPluginSystem 后返回不同的优先级, 最终会有 3 种情况:
DiscreteEvent: 优先级最高, 包括 click, keyDown, input 等事件, 源码
UserBlockingEvent: 优先级适中, 包括 drag, scroll 等事件, 源码
ContinuousEvent: 优先级最低,包括 animation, load 等事件, 源码

监听原生事件: 对齐 DOM 元素和 fiber 元素
收集 listeners: 遍历 fiber 树, 收集所有监听本事件的 listener 函数.
派发合成事件: 构造合成事件, 遍历 listeners 进行派发.

# server component

从这个例子可以看到，Server Component 有这么几个特性：

Server Component 是个 React 组件，基于传入的 props 来渲染界面，但是不能使用 state 和 effects，其他和平常的 React 组件没有区别
Server Component 具备服务端的能力，比如直接查询 DB、访问文件等
Server Component 可以 import Client 组件，为了方便区分，Client 组件以 .client.js 结尾
Server Components 不会被打包在 bundle 里，Server Component 里依赖的 npm 也不会

- 通过 webpack 打包编译 src 下的代码，通过 react-server-dom-webpack 插件只打包 Client Components
- 启动 Express 服务，访问页面地址的时候，返回 html 文件
- 页面里的 Client bundle 发起请求，获取首屏内容
- 服务端通过 react-server-dom-webpack 里的 writer 把 Server 组件和 Client 组件序列化为一种特殊的格式，返回给 Client
- Client 拿到响应数据之后，还是通过 react-server-dom-webpack 来进行反序列化，最终进行渲染

与 ssr 完全不是一个东东：

1、SSR 是在服务端把 js 转成 HTML，返回给客户端；而 Server Components 是在客户端渲染的，服务端输出的是 chunks
2、SSR 的请求响应是 HTML，无法保留客户端的状态，而 Server Components 在渲染的时候，是不影响 Client Components 的状态的

1、Server Components 有局限性，比如不能使用 state、effects、以及浏览器的一些 API，适合用在纯展示的组件
2、是 BFF 的一个新思路

# react 18 api

- useId
- useTransition/startTransition， 以 transition 的优先级处理更新
- useDeferredValue， 算是官方实现的防抖节流
- useSyncExternalStore， 用于同步外部数据源的状态
- useInsertionEffect 在所有 DOM 突变 之前同步触发。使用它在读取 useLayoutEffect 中的布局之前将样式注入 DOM。由于这个 hook 的作用域有限，所以这个 hook 不能访问 refs，也不能安排更新。

- react-dom/server: renderToPipeableStream/renderToReadableStream， 替代 renderToString
