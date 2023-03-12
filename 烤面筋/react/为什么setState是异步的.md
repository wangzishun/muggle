# 为什么 setState 是异步的

[RFClarification: why is setState asynchronous?](https://github.com/facebook/react/issues/11527#issuecomment-360199710)

- 保持内部一致性：props 的更新是异步的, 因为 re-render 父组件的时候, 传入子组件的 props 才变化；为了保持数据一致, state\props\refs, state 也不直接更新, 都是在 flush 的时候更新
- 将 state 的更新延缓到最后批量合并再去渲染对于应用的性能优化是有好处的, 如果每次的状态改变都去重新渲染真实 DONM, 那么它将带来巨大的性能消耗
- 立即更新回来视觉上的不适应, 比如在页面打开时候, 多个请求发布导致频繁更改 Loading 状态, 会导致 Loading 图标闪烁

之前的版本是有 isBatchingUpdates 锁的概念, react17 中没有这个变量, 当 render / 合成事件触发时都会改变 executionContext 的值, 只要绕开 react 内部触发更改 executionContext 的逻辑, 就能保证 executionContext 为 NoContext, 进而让 ensureRootIsScheduled 中去调用 flushSyncCallbackQueue\performanceSyncWorkOnRoot, 进行同步渲染. setState 的“异步”并不是说内部由异步代码实现, 其实本身执行的过程和代码都是同步的, 只是合成事件和钩子函数的调用顺序在 setState 执行之前, 导致 setState 后 class 组件没法立马拿到更新后的值, 函数式组件拿不到是因为闭包导致的, 除了 ref 无论怎样都拿不到.

react17 legacy 模式下或者之前的版本, 如果不是在事件回调和钩子函数中执行的 setState, 想要批量更新的话, 可以使用 ReactDOM.unstable_batchedupdates.
对于 react18 来说, 默认启用批量更新, 如果想要同步效果的话, 可以使用 ReactDOM.flushSync, 把更新任务放在一个较高的优先级中
