# 为什么要引入 hooks

这个问题官网上有很好的解释，当然作为开发者也对这个问题有一些自己的理解。

1. class 组件中，可能有很多逻辑相似的代码分布在不同的生命周期内，这样的代码逻辑不够纯洁，难以复用，不利于维护。拿一个简单的发布订阅来说，如果一个组件有多个订阅事件，class 中需要在 mount 的时候订阅，再 unmount 的时候取消订阅，这些事件交互就混在了一起的。但是 hook 的方式就很好的解决了这个问题，可以用一个 effect 来包裹一个订阅和取消，开发的关注点可以聚焦在具体的功能上。
2. class 组件中，还有 this 指向的问题，但其实还有一个 this 导致的隐形的性能问题。我们为了避免 this 问题，可能会用 bind 或者是箭头函数，这代表 class 组件的函数都不在原型链上，所以没办法共享，是虚假的面向对象，又因为 class 组件的实例会保存在 fiber.stateNode 上，所以这些箭头函数也会一定会占用更多的内存。
3. shouldeComponentUpdate/getSnapshotBeforeUpdate/getDerivedStateFromProps 这个三个 api 相对于 effect 来说真的不是特别好用，
4. 从打包体积的角度来说，class 经过 babel 编译相对于函数来说会多出很多代码

当然现在也不能完全的抛弃 class，ErrorBoundary 的场景还是需要写 class

# memoizedState

useState/useReducer：memoizedState 保存 state 的值
useEffect：memoizedState 保存回调函数、依赖项等的链表数据结构 effect，effect 链表同时会保存在 fiber.updateQueue 中。
useRef：memoizedState 保存{current: 1}
useMemo：memoizedState 保存[callback(), depA]
useCallback：memoizedState 保存[callback, depA]。与 useMemo 的区别是，useCallback 保存的是 callback 函数本身，而 useMemo 保存的是 callback 函数的执行结果

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

# useLayoutEffect/useEffect 的实现

mount 的时候创建 hook，创建 effect(在 pushEffect 中), 挂载到 hook.memoizedState 上, 即 hook.memoizedState = effect，effect 也是一个单向环状链表，还会保存在 fiber.updateQueue 中。从数据结构来看，一个 effect 有 tag/create/destory/deps/next 组成。在 update 的时候会根据比较依赖是否变化来更新 effect，依赖不变的情况下也会新建 effect，只是不带 HasEffect 标记，不过他们都会继续用之前的 destory, 只有在 effect.create 重新执行的时候才会产生新的 destory。

这些 effect 会根据 tag 的不同在 commit 阶段被处理 Update/Passive 通过 scheduleCallback 调度 flushPassiveEffects。layoutEffect 会在 mutation 阶段执行 destory，在 layout 阶段执行 create。另外在组件被销毁的时候也会执行 effect.destory。
