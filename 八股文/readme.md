# 什么是原型、原型链

原型本质是一个对象。构造函数上有一个 prototype 属性指向这个构造函数的原型对象，用来为实例对象提供共享的属性，实现基于原型的继承和属性共享。
通过指针一层层关联起来的原型对象就称为原型链。当读取实例的某个属性时，如果实例本身没有，那么就会通过`__proto__`指针来查找原型对象上的属性，如果还是没有，就会去找原型的原型。

```js
function Ctor() {} // 构造函数
const instance = new Ctor() // 实例对象

instance.__proto__ === Ctor.prototype // 实例的 proto 指针指向他构造函数的原型对象 prototype
Ctor.prototype.__proto__ === Object.prototype // 构造函数的原型对象 prototype 的 proto 指针指向 Object 的原型对象 prototype
Object.prototype.__proto__ === null // Object 的原型对象 prototype 的 proto 指针指向 null

Ctor.__proto__ === Function.prototype // 构造函数本身也是一个实例，所以他也有原型链，他的 proto 指针指向 Function.prototype
Function.prototype.__proto__ === Object.prototype
```

# 浏览器的多进程架构

目前 chrome 浏览器包含 1 个浏览器主进程、1 个 GPU 进程、1 个网络进程、多个插件进程、多个渲染进程。
浏览器进程。界面展示、用户交互、子进程管理、存储。
渲染进程。JS 引擎负责解释执行 js，渲染引擎负责解析 html、css 进行排版
网络进程。网络资源加载，html、js、css、图片、视频

# 执行上下文

# 栈空间和堆空间，为什么要分两个空间

内存空间分三块，代码空间、栈空间、堆空间，一般来说原始的数据类型放在栈空间（执行上下文中），引用类型放在堆空间中（执行上下文中存放着堆中的地址）。

JS 引擎通过栈来维护程序的执行状态，所以栈的切换效率直接影响程序的执行效率，所以有必要将大数据存储到堆中，保持栈结构的轻量。

# 什么是闭包

从技术角度上来说，所有的函数都是闭包。闭包的定义是：引用了外部函数作用域中的变量的函数。

为什么会产生闭包？
当一个函数 foo 执行的时候，JS 引擎对函数进行词法分析、语法分析生成函数执行上下文，编译过程中如果发现有内部函数 bar，会对内部函数进行一次快速的词法扫描，扫描中发现内部函数 bar 引用了外部函数的变量 A，JS 引擎会判断产生了闭包，于是在堆空间中创建一个 closure(foo) 的对象用来保存变量 A，如果再遇到一个被引用的变量 B，就会将变量 B 加入到这个 closure(foo) 对象中。对于内部函数 bar 来说，他的作用域链指向的是这个闭包对象。

产生闭包的核心：1.预扫描内部函数；2.把内部函数引用的外部变量保存到堆中。

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

# commonJS

1. 运行时加载。module.exports 属性需要模块执行过后才有
2. 输出的是值的拷贝，换句话来说，一旦导出一个值，那么模块内部的变化无法影响这个值
3. 通过 require 同步加载，加载完成后才能执行后面的操作。

# ES module

1. 对外接口是一种静态定义，代码静态解析阶段就会生成
2. 输出的是值的引用，动态引用。JS 引擎在对脚本进行静态分析时，遇到 import 语句时会生成一个只读引用，等到脚本执行时根据只读引用去取值
3. import 当作函数时可以异步加载，有一个独立的模块依赖解析阶段

# 项目构建

1. 代码转换，把 ts、less、sass、vue、jsx、tsx 编译 js、css、html
2. 代码优化，删除无用的代码、注释、log，压缩代码体积
3. 代码分割
4. 模块合并
5. 自动刷新
6. 代码校验
7. 自动发布

# webpack 一切皆模块，通过 loader 转换文件，通过 plugin 注入钩子，输出由多个模块组合的文件

# vite
