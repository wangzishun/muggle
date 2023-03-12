# useSyncExternalStore

如果用到了 useSyncExternalStore 这个 api，我研究他的时候发现再 commit 阶段还会再检查一次数据有没有被修改过。如果被修改过那么就会强制用同步模式去重新进行 render。

这个 api 接收三个参数，subscribe、getSnapshot、getServerSnapshot，其中 subscribe 是订阅函数，getSnapshot 是获取快照函数，getServerSnapshot 是获取服务端快照函数，另外他还有一个高级版本 useSyncExternalStoreWithSelector，额外接收 selector 和 equal 两个参数，就是从 getSnapshot 中获取的数据进行了一次选择，equal 就是自定义的对比。

和其他的 hook 一样也分为 mount 和 update，mount 的时候会 mountWorkInProgressHook, 执行 getSnapshot 并把结果赋值给 hook.memoizedState，hook.queue 上保存 state 和 getSnapshot， 然后通过 Effect 去执行 subscribe，并传入内部的更新钩子，这个时候我们外部的观察者就收集到了内部的更新钩子。当数据更新的时候我们需要自己去执行观察到的钩子函数来触发 react 的调度更新 forceStoreRerender。update 的时候会通过 updateWorkInProgressHook 拿到 hook，并且执行 getSnapshot，然后将 memoizedState 也就是上一次的快照进行对比，如果有变动那么久标记这个 fiber 接收到了更新。为了保证数据的一致性，react 在 commit 阶段还会再额外检查一下数据有没有被修改过，如果有的话还会再发起一次调度更新。这是因为 concurrent 模式的 render 过程中外部数据可能已经发生了改变，但是更新的优先级没有变，导致 scheduler 不会取消正在执行的任务，导致 render 过程中使用的数据与 store 中的真实数据有差异，为了保证数据的一致性，就只能在 render 之后的 commit 阶段再次检查。同步模式中如果是比较早的 effect 也可能会导致这个问题。这就是官网上反复提到的撕裂 tearing。

兼容处理是靠订阅和 forceUpdate 解决的。关键点在于那个 useLayoutEffect 部分，其中判断了外部状态的最新值与渲染的值（capture value）是否一致，不一致就强制更新（并且是同步的），最终效果仍是用户会最终得到一个一致的渲染结果（但中间还是会有 tearing，只是因为同步更新的原因，浏览器直到控制权交回后才会绘制 dom）
