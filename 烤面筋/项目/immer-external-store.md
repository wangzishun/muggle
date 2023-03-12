# immer-external-store

# 为什么要做这样一个东西？

社区的一些状态管理工具我也有过使用的经验，往大了说有 redux、mobx、zustand、constate，zustand 是我用过最舒服的状态管理库，但我个人感觉还是差点意思。react 的社区生态，往好了讲是百花齐放，说不好听的就是没有一个统一的标准，每个人的审美都是不同的嘛，你有你的定海神针，我也要我的九齿钉耙。再说了，人要有梦想，万一火了呢。

# 优势是什么？

简单容易上手，api 设计上我尽量往 React.useState 靠齐。比如初始化 store 的时候，既支持普通对象也支持函数或者是异步函数，我们的很多业务场景都是需要先请求接口再进行渲染。（相比于 hook 的方式来说少一次更新，比如 useReqeust 不知道您有没有用过，他是先有一个 undefined，然后变为 loading，最后再次更新 state，除了第一次 mount 还需要再更新 2 次。但是异步创建 store 的话就只需要额外更新一次,当然这个差距很小。）

第二个优势是支持两种类型的选择器，我们在写 redux 或者 zustand 的时候如果需要支持按需更新的话, 需要一些 Selector 的操作, 就是通过方法去选择你想要的数据。我的工具除了方法选择器之外，还支持字符串路径的选择方式，比如说你的状态是 a 嵌套 b 嵌套 c，那么你就可以 useState 字符串('a.b.c') 来拿到这个数据，最重要的一点是 ts 类型支持也很友好，可以提示你都能输入什么字符串，我觉得这个用起来是非常方便的。而且从某种意义上来说，使用字符串去获取对象中的某个值的方式，因为我是用 new Function 去构造一个函数并缓存，减少了 function 关键字，所以打包出来的体积一般来说比方法选择器更小，但是内存占用方面可能有一些的问题。process.memoryUsage()/performance.memory

第三个优势是直接内置了 immer，相对于其他的状态库虽然可能不够纯洁，但非常适合在实际场景中去使用。因为 redux/zustand 这些其实在使用的过程中也会用到 immer，但是中间件的结合方式我个人觉得不是特别的优雅。

# 有遇到什么问题吗？

做这个项目其实是一个偶然，因为我在在学习 redux 的源码的时候，看着看着发现好像我自己也能实现一个状态管理库，然后我就尝试着安装预想的思路写了一下，发现走的通而且使用上还不错，于是世界上就又诞生了一个状态管理库。

其实现在从技术角度看来我这个库的代码是非常简单的，当时开发他也就花了一整够周末的时间，刚好两天，后来零零散散的发现一些问题就打打补丁，简单的重构一下。花费最多的是在写 TS 类型，你也知道，使用者有多方便，库开发者写类型就有多痛苦。前面也说了这个工具还支持字符串 path 的使用方式，怎么更友好的去提示这个字符串我是绞尽脑汁都没想出来，后来参考了大量的代码终于让我抄到了，当然我到现在也没看明白他咋整的，这个东西他不只是能够提示有 a.b.c 字符串可以选择，他也得支持从 a.b.c 推导出值的类型，也就是说能从对象推导出都有哪些路径还得从这个路径推导出值的类型，这个东西我真的是没看懂。

还有就是 use-sync-external-store， 这个 api，react18 才有的，后来在 zustand 的源码里看到有 react16、17 用的 polyfill 版本。所以我也不需要担心版本低用不了的问题。

然后就是打包细节上的优化， 因为我是用 rollup 加 babel 插件打包的，所以看的比较清晰，比如说一个简单的 typeof 关键字，如果只是 typeof === function 或者是 typeof === string 的话没有问题，但如果是 typeof === object，那么 babel 会引入一个 typeof 的 polyfill 函数来兼容 symbol 类型，gzip 后不到 100b，我一个小小的库肯定是希望极致的精简，就要配置一下 babel 去掉这些代码 exclude@babel/plugin-transform-typeof-symbol。
还有另外一种细节，比如，函数的默认参数、可选链式符，async/await、参数扩展运算符，其实换个写法也能实现的这种我都会换一个写法。

说实话，这些细节加起来，对于我这个 100 行不到的库来说，打包出来的代码可能会有 500b 左右的差距， gzip 后应该有 200b。我没有实际去测量过，但应该差不多。有的时候我也会觉得我为了这么点东西浪费了时间效果还不大，但我觉得这些都是经验，实践过一次之后下一次就知道怎么样做才是最佳方案，只有在最开始探索的时候会花多一点时间，而且这点经验在做性能优化的时候其实还是有那么一点点参考价值的。

现在我团队里的有五个项目都在用这个库。

## useSyncExternalStore 原理？

这个 api 接收三个参数，subscribe、getSnapshot、getServerSnapshot，其中 subscribe 是订阅函数，getSnapshot 是获取快照函数，getServerSnapshot 是获取服务端快照函数，另外他还有一个高级版本 useSyncExternalStoreWithSelector，额外接收 selector 和 equal 两个参数，就是从 getSnapshot 中获取的数据进行了一次选择，equal 就是自定义的对比。

和其他的 hook 一样也分为 mount 和 update，mount 的时候会 mountWorkInProgressHook ,执行 getSnapshot 并把结果赋值给 hook.memoizedState，hook.queue 上保存 state 和 getSnapshot， 然后通过 Effect 去执行 subscribe，并传入内部的更新钩子，这个时候我们外部的观察者就收集到了内部的更新钩子。当数据更新的时候我们需要自己去执行观察到的钩子函数来触发 react 的调度更新 forceStoreRerender。update 的时候会通过 updateWorkInProgressHook 拿到 hook，并且执行 getSnapshot，然后将 memoizedState 也就是上一次的快照进行对比，如果有变动那么久标记这个 fiber 接收到了更新。为了保证数据的一致性，react 在 commit 阶段还会再额外检查一下数据有没有被修改过，如果有的话还会再发起一次调度更新。这是因为 concurrent 模式的 render 过程中外部数据可能已经发生了改变，但是更新的优先级没有变，导致 scheduler 不会取消正在执行的任务，导致 render 过程中使用的数据与 store 中的真实数据有差异，为了保证数据的一致性，就只能在 render 之后的 commit 阶段再次检查。同步模式中如果是比较早的 effect 也可能会导致这个问题。这就是官网上反复提到的撕裂 tearing。

兼容处理是靠订阅和 forceUpdate 解决的。关键点在于那个 useLayoutEffect 部分，其中判断了外部状态的最新值与渲染的值（capture value）是否一致，不一致就强制更新（并且是同步的），最终效果仍是用户会最终得到一个一致的渲染结果（但中间还是会有 tearing，只是因为同步更新的原因，浏览器直到控制权交回后才会绘制 dom）

## immer 的原理？

copy on write, 写时拷贝。就是在 写 操作的时候，进行浅拷贝，然后写入属性，这个时候，copy 和原来的 state 共享了除 写 属性之外的所有属性.

通过 Map 来记录复制后的对象，Map 中的 key 就是原始对象中的值，Map 中的值就是修改后的草稿。第一步是通过 proxy 对原始对象进行代理，核心是代理 get 和 set，get 主要是懒代理，就是针对每一个访问到的 target.key 再次代理，因为在 js 中的赋值语句是分为两步的，他要先读再写。set 劫持就是将 target 浅拷贝一份，然后在 copy 的对象上进行赋值，之后再存到 map 中，set 中的 target 就是访问到的具体的值。写完草稿之后会递归访问原始对象中的每个属性，看看他们在 Map 中是不是被标记过，如果被标记的话就取出来放到新对象上。就是很经典的写时拷贝

immutable 对象所要保证的就是每次更新需要产生一个新对象。同时考虑性能问题，就需要保证对象只是发生改变的属性产生新的引用，其他没发生改变的属性仍然使用旧的引用。
不可变数据 就是一旦创建，就不能再被更改的数据。对该对象的任何修改或添加删除操作都会返回一个新的对象。要避免深拷贝把所有数据都复制一遍带来的性能损耗，使用 Structural Sharing（结构共享），即如果对象树中一个节点发生变化，只修改这个节点和受它影响的父节点，其它节点则进行共享。

produce 的工作分为三个阶段，分别为创建代理（createDraft）、修改代理（produceDraft）、定稿（finalize），创建代理所做的就是对传入的第一个参数 base 对象进行代理，实现后面修改代理时，也就是传入的回调函数执行时，可以进行 ShallowCopy on write 的操作，最终定稿就是把进行修改的对象的引用指向 ShallowCopy 的对象上面。

immer 实现深拷贝的过程分为 draft 和 commit 两个阶段的，其实这个和 git 很像。然后在学习 react 的过程中，但是也感觉有些相似，react 渲染的过程也是 draft 和 commit ，virtual-dom 似乎就像是一个 draft 的过程，最终 commit 才是真正同步的过程

读的时候判断是否被修改过，没有就直接返回，

## zustand 原理？

最开始的 zustand 是通过观察者模式 + useState、useRef、useEffect ，在 effect 的时候来进行对比实现的数据更新同步，然后又加了一个中间件的机制。后来有一个版本更新，使用了 观察者 + useSyncExternalStore 实现。

版本一：创建 store 拿到对外暴露唯一接口 useStore ，定义全局状态。通过 const bears = useStore(state => state.bears) 获取状态并与组件绑定。这一步 store 会执行 subscribe(listener) 添加订阅操作，同时该方法内置有 forceUpdate() 函数用于触发组件更新。使用 set 钩子函数修改状态。即调用的 setState 方法，该方法会执行 listeners.forEach((listener) => listener(state, previousState)) 通知所有订阅者执行更新。

版本二：的要点在于 useSyncExternalStore 的实现，

## Redux Toolkit？

我不喜欢 redux 的一个原因是模版代码太多，还要定义各种 reducer type， 感觉搞的特复杂。toolkit 是针对 react 做了一些易用性的封装，提供了很多的 api，configureStore/createSlice/useSelector/useDispatch，还需要结合 context.Provider 才能玩转一整套，这一套东西光是听一听就脑瓜子大，可能是我的小脑袋瓜容量不够大，记不住这么多 api。当然不可否认的是它里面有很多代码是非常优秀的， 比如说 compose 函数，比 koa 还要简洁的洋葱模型，震惊我好久。

## 性能问题？

根据我的分析，不会产生性能问题。首先假设在 100 个地方用了 useSyncExternalStore，然后去执行所有订阅函数，对于第一个执行的订阅来说，react 会以同步优先级调用 scheduledCallback 创建一个 task 进行调度，但是对于剩下的 99 个订阅来说并不会为他们创建 task 进行调度，因为他们产生的渲染优先级 line 是一样的，在 scheduledCallback 之前会判断当前的渲染优先级，和下一次更新优先级，相同的时候就直接 return 掉了，相当于节流处理。

其实我写完这个库的时候，感觉 react 越来越像是一个操作系统，如果作为一个 view 层来说，他的侵入性越来越强，离 view lib 越走越远了，感觉挺魔幻的，可能这就是大佬们的目标吧。
