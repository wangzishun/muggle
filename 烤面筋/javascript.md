- [杂项](#杂项)
  - [import 和 require 的区别](#import-和-require-的区别)
  - [commonJS vs ES module](#commonjs-vs-es-module)
  - [NPM 模块安装机制](#npm-模块安装机制)
  - [Tree shaking](#tree-shaking)
- [JavaScript](#javascript)
  - [import 原理](#import-原理)
  - [什么是原型、原型链](#什么是原型原型链)
  - [浏览器的多进程架构](#浏览器的多进程架构)
  - [栈空间和堆空间, 为什么要分两个空间](#栈空间和堆空间-为什么要分两个空间)
  - [垃圾回收](#垃圾回收)
  - [执行上下文](#执行上下文)
  - [作用域](#作用域)
  - [作用域链](#作用域链)
  - [什么是闭包](#什么是闭包)
  - [浏览器中的事件循环](#浏览器中的事件循环)
  - [nodejs 中的事件循环](#nodejs-中的事件循环)
  - [JS 为什么是单线程](#js-为什么是单线程)
  - [this 指向, 方法函数的调用](#this-指向-方法函数的调用)
  - [JS 异步解决方案以及优缺点](#js-异步解决方案以及优缺点)
- [Promise](#promise)
- [IntersectionObserver](#intersectionobserver)
  - [getComputedStyle](#getcomputedstyle)
  - [MessageChannel](#messagechannel)
  - [requestAnimationFrame](#requestanimationframe)
  - [Object.prototype.toString.call() 、 instanceof 以及 Array.isArray()](#objectprototypetostringcall--instanceof-以及-arrayisarray)
  - [Proxy 支持的拦截操作：](#proxy-支持的拦截操作)
  - [WebWorker](#webworker)
  - [ServiceWorker](#serviceworker)
- [Node.js](#nodejs)
  - [stream 流](#stream-流)
  - [模块加载机制](#模块加载机制)
  - [exports 和 module.exports 的区别](#exports-和-moduleexports-的区别)
  - [循环引用](#循环引用)

# 杂项

## import 和 require 的区别

在 ES6 当中，用 export 导出接口，用 import 引入模块。但是在 node 模块中，使用 module.exports 导出接口，使用 require 引入模块。

require 是 AMD 规范引入方式；import 是 ES6 的一个语法标准。
require 是运行时调用，所以 require 理论上可以运用在代码的任何地方；import 是编译时调用，所以必须放在文件开头

require 是赋值过程。module.exports 后面的内容是什么，require 的结果就是什么，比如对象、数字、字符串、函数等，然后再把 require 的结果赋值给某个变量，它相当于 module.exports 的传送门
我们在 node 中使用 babel 支持 ES6，也仅仅是将 ES6 转码为 ES5 再执行，import 语法会被转码为 require

## commonJS vs ES module

1. 运行时加载。module.exports 属性需要模块执行过后才有
2. 输出的是值的拷贝, 换句话来说, 一旦导出一个值, 那么模块内部的变化无法影响这个值
3. 通过 require 同步加载, 加载完成后才能执行后面的操作。

4. 对外接口是一种静态定义, 代码静态解析阶段就会生成
5. 输出的是值的引用, 动态引用。JS 引擎在对脚本进行静态分析时, 遇到 import 语句时会生成一个只读引用, 等到脚本执行时根据只读引用去取值
6. import 当作函数时可以异步加载, 有一个独立的模块依赖解析阶段

## NPM 模块安装机制

- npm install 之后, 查询 node_modules 目录中是否已经存在目标模块, 不存在时, 向 registry 源查询模块压缩包的地址, 下载压缩包放到.npm 目录中, 再解压到当前项目的 node_modules 目录

- npm 把项目当作一个树结构, node_modules 相当于树的子节点 children. 确定首层依赖模块, 也就是 dependencies 和 devDependencies 中指定的模块,
  - 从首层模块开始获取更深的依赖, 递归
    - 获取模块的信息, 如果有 lock 文件就直接读取, 没有的话就会根据版本号去 registry 源仓库中查询获取(npm view\info\show\v)
    - 拿到模块信息后, 从本地缓存中直接拿, 或者是根据地址去下载压缩包
    - 查找该模块的依赖
  - 经过上一步我们得到了一个完整的依赖树, 为了解决依赖中包含很多重复模块, 安装的过程中 npm 有一个 dedupe 的过程进行模块扁平化. 对于一个模块来说, 会先检查顶层是否存在名称相同的模块, 如果不存在将此模块安装在顶层, 如果存在并且满足版本兼容就直接跳过, 否则在这个模块的 node_modules 中安装. 把凡是能够去除的冗余模块, “重定向”到名称／版本兼容的一级模块
    - 模块名相同且 semver 兼容。每个 semver 都对应一段版本允许范围, 如果两个模块的版本允许范围存在交集, 那么就可以得到一个兼容版本,
  - 安装依赖的过程伴随着, 生命周期 preinstall \ install \ postinstall \ prepublish \ prepare
  - `npm cache clean` `npm config get xxx`

## Tree shaking

是基于 ES6 模板语法（import 与 exports），主要是借助 ES6 模块的静态编译思想，在编译时就能确定模块的依赖关系，以及输入和输出的变量
Tree shaking 做了两件事：编译阶段利用 ES6 Module 判断哪些模块已经加载;判断那些模块和变量未被使用或者引用，进而删除对应代码

# JavaScript

JavaScript 的核心 ECMAScript 描述了该语言的语法和基本对象；DOM 描述了处理网页内容的方法和接口；BOM 描述了与浏览器进行交互的方法和接口。

## import 原理

简单来说就是闭包的运用，为了创建 Module 的内部作用域，会创建一个包装函数，包装函数会返回一个对象，对象上能访问到模块导出的变量，这些变量不是直接导出的，而是通过 defineProperty 定义的 get 方法包了一层，这也是 import 和 require 之间的区别。当然这个 defineProperty 是我在 webpack 中看到的，浏览器原生的实现可能不一样。

## 什么是原型、原型链

原型本质是一个对象. 构造函数上有一个 prototype 属性指向这个构造函数的原型对象, 用来为实例对象提供共享的属性, 实现基于原型的继承和属性共享.
通过指针一层层关联起来的原型对象就称为原型链. 当读取实例的某个属性时, 如果实例本身没有, 那么就会通过`__proto__`指针来查找原型对象上的属性, 如果还是没有, 就会去找原型的原型.

```js
function Ctor() {} // 构造函数
const instance = new Ctor() // 实例对象

instance.__proto__ === Ctor.prototype // 实例的 proto 指针指向他构造函数的原型对象 prototype
Ctor.prototype.__proto__ === Object.prototype // 构造函数的原型对象 prototype 的 proto 指针指向 Object 的原型对象 prototype
Object.prototype.__proto__ === null // Object 的原型对象 prototype 的 proto 指针指向 null

Ctor.__proto__ === Function.prototype // 构造函数本身也是一个实例, 所以他也有原型链, 他的 proto 指针指向 Function.prototype
Function.prototype.__proto__ === Object.prototype
```

## 浏览器的多进程架构

目前 chrome 浏览器包含 1 个浏览器主进程、1 个 GPU 进程、1 个网络进程、多个插件进程、多个渲染进程.
浏览器进程. 界面展示、用户交互、子进程管理、存储.
渲染进程. JS 引擎负责解释执行 js, 渲染引擎负责解析 html、css 进行排版
网络进程. 网络资源加载, html、js、css、图片、视频

## 栈空间和堆空间, 为什么要分两个空间

内存空间分三块, 代码空间、栈空间、堆空间, 一般来说原始的数据类型放在栈空间(执行上下文中, 大小固定操作简单), 引用类型放在堆空间中(大小不固定, 执行上下文中存放着堆地址).

JS 引擎通过栈来维护程序的执行状态, 也就是执行上下文的入栈出栈, 所以栈的切换效率直接影响程序的执行效率, 所以有必要将大数据存储到堆中, 保持栈结构的轻量. 栈内存中的变量在出栈时会立即进行垃圾回收, 而堆内存需要从 root 进行可达性测试后才能回收.

当然也有例外, 当原始类型被判断为闭包时, 会存储到堆内存中 closure(foo)

## 垃圾回收

分代回收：在 V8 中，对象的内存分配是基于分代原理的。分代原理认为新的对象很快就死亡，老的对象活得更久因此，在 V8 中将对象分为（新生代、老年代等）

新生代存储的对象比较少，采用空间换时间的 scavenge 算法：整个空间分为两块，变量仅存在其中一块，回收的时候将存活变量复制到另一块空间，不存活的回收掉，周而复始轮流操作。
复制：首先所有的存活对象都被复制到另一个空闲的区域中。标记：设置存活对象的标记，以便进行下一步的整理。整理：将所有标记的存活对象整理到同一端，以便新的对象分配使用剩余的空间。

晋升：如果新生代的某个对象经过两次垃圾回收还存活，那么这个对象将被晋升到老生代中去。

老生代使用标记清除和标记整理，标记清除：遍历所有对象标记标记可以访问到的对象（活着的），然后将不活的当做垃圾进行回收。回收完后避免内存的断层不连续，需要通过标记整理将活着的对象往内存一端进行移动，移动完成后再清理边界内存。
标记：从根节点开始，遍历所有对象并标记所有可达对象。清除：遍历堆空间中的所有对象，清除未标记的对象。
为了解决标记-清除算法的碎片问题。标记-整理：清除未标记对象之后，进行一次整理操作来消除空间碎片。

## 执行上下文

ExecutionContext = {
ThisBinding = <this value>,
LexicalEnvironment = { ... },
VariableEnvironment = { ... },
}

## 作用域

全局作用域、函数作用域、块作用域（ES6）、eval 作用域，总的来说被花括号包裹的就是一个独立的作用域。作用域就是变量与函数的可访问范围，即作用域控制着变量和函数的可见性和生命周期。

创建执行上下文，变量环境和词法环境，变量环境是用来存储 var 变量和函数声明的，词法环境是用来存储 let const。

## 作用域链

每个执行上下文的变量环境中，都包含了一个外部引用，用来指向外部的执行上下文，我们把这个外部引用称为 outer。
当一段代码使用了一个变量时，JavaScript 引擎首先会在“当前的执行上下文”中查找该变量， 比如上面那段代码在查找 myName 变量时，如果在当前的变量环境中没有查找到，那么 JavaScript 引擎会继续在 outer 所指向的执行上下文中查找

## 什么是闭包

从技术角度上来说, 所有的函数都是闭包. 闭包的定义是: 引用了外部函数作用域中的变量的函数.

为什么会产生闭包？
当一个函数 foo 执行的时候, JS 引擎对函数进行词法分析、语法分析生成函数执行上下文, 编译过程中如果发现有内部函数 bar, 会对内部函数进行一次快速的词法扫描, 扫描中发现内部函数 bar 引用了外部函数的变量 A, JS 引擎会判断产生了闭包, 于是在堆空间中创建一个 closure(foo) 的对象用来保存变量 A, 如果再遇到一个被引用的变量 B, 就会将变量 B 加入到这个 closure(foo) 对象中. 对于内部函数 bar 来说, 他的作用域链指向的是这个闭包对象.

产生闭包的核心: 1.预扫描内部函数; 2.把内部函数引用的外部变量保存到堆中.

## 浏览器中的事件循环

简单来说每执行一个宏任务就清空完微任务队列

通常我们都会说 JS 是单线程的, 但在实际工作中还需要其他线程配合, 比如定时器、HTTP 请求、UI 渲染、鼠标键盘操作. 事件循环是为了解决主线程与其他线程之间的通信问题, 通过队列和循环的方式来处理其他线程发过来的任务.

简单来说, JS 执行过程中遇到异步任务的 api 调用, 就会将任务交给其他线程去处理, 完成后将回调函数加入到事件队列中等待消费, 事件循环就是主线程循环读取队列中的任务并执行.

复杂来说, JS 引擎有执行栈、执行上下文的概念, 脚本在执行的时候会创建一个全局执行上下文压入到栈中, 在执行过程中遇到的每一个函数调用都会进行词法解析、语法解析拿到 AST, 并为该函数创建执行上下文压入到栈中去执行. 执行过程中如果遇到宏任务 api 调用, 会将任务委托给其他线程去处理, 完成后将回调函数放到对应的事件队列中; 如果遇到微任务 api 调用, 会将回调函数存储到微任务队列中. 当执行栈中的所有任务执行完毕后, 会到达微任务检查点, 如果存在微任务则依次执行回调直到微任务队列为空, 接下来会浏览器会根据本次事件循环是否需要渲染, 进而执行渲染逻辑, 本轮事件循环结束. 下一轮开始时会根据优先级、入队顺序从多个事件队列中选出一个宏任务压入栈中执行.

总结: 选一个宏任务入栈执行, 栈空时检查清空微任务队列, 浏览器判断是否需要 UI 渲染, 下一轮循环挑选一个宏任务入栈.
macro => micro => ui render => scroll/resize、requestAnimationFrame、micro、IntersectionObserver => requestIdleCallback => next macro

异步的任务源分两种: macro-tack、micro
宏任务: setTimeout、setInterval、用户交互、UI 渲染、网络请求, 输入事件(鼠标滚动、点击、移动)
微任务: promise.then、async/await、MutationObserver

nodejs 中宏任务还有 setImmediate、fs.readFile
nodejs 中微任务还有 process.nextTick

还有一些虽然不是宏任务但表现形式上类似的 api: requestAnimationFrame

## nodejs 中的事件循环

timers 定时器：本阶段执行已经安排的 setTimeout() 和 setInterval() 的回调函数。
pending callbacks 待定回调：执行延迟到下一个循环迭代的 I/O 回调。
idle, prepare：仅系统内部使用。
poll 轮询：检索新的 I/O 事件;执行与 I/O 相关的回调（几乎所有情况下，除了关闭的回调函数，它们由计时器和 setImmediate() 排定的之外），其余情况 node 将在此处阻塞。
check 检测：setImmediate() 回调函数在这里执行。
close callbacks 关闭的回调函数：一些准备关闭的回调函数，如：socket.on('close', ...)。

## JS 为什么是单线程

核心目的是为了保证 DOM 的一致性

1. JS 主要是用来实现用户与浏览器的交互和操作 DOM, 如果是多线程的, 都去操作 DOM 时需要竞争资源, 如果在多线程的场景想要实现 DOM 的一致性, 那么需要引入更复杂的架构设计, 单线程避免了更复杂的架构设计
2. DOM 节点可以通过 JS 引擎和 UI 排版引擎两种方式去变更, 这两个引擎在运行时是互斥的, 也是为了保证 DOM 的一致性
3. 浏览器中的 JS 也不完全是单线程的, 现在有 WebWorker 允许创建多个线程, 但是子线程依旧不允许操作 DOM, 本质上单线程的目的没有改变

## this 指向, 方法函数的调用

对于一般函数来说有四种情况:

1. 作为一个对象的属性方法调用 obj.test()
2. 通过 call、apply、bind 修改 this 指向
3. new 构造函数时的 this 指向对象实例
4. 直接调用(没有使用调用者显式地调用一个函数, JS 的解释器就会把全局对象当作调用者), this 指向 全局对象或者是 undefined(use strict 严格模式)

对于箭头函数来说: this 永远绑定了定义箭头函数所在的那个对象

对于 react class componet 来说, 在 class 中声明的方法都会自动地使用严格模式, 所以需要借助 bind 或尖头函数来确定 this.

## JS 异步解决方案以及优缺点

- 回调函数, 缺点是回调地狱, 调试困难, 嵌套过多的话难以按顺序处理, 用 try catch 错误捕获困难
- 发布订阅 执行流程不清晰
- Promise 本身是立即的同步构造函数, 他的实例可以进行链式调用, 还能实现一些 race/all/any/allSettled 的流程控制逻辑,但是有的时候 then 太多, 错误捕获依旧需要写到回调中, 有轻微的回调嵌套
- Generator 生成器, 通过 yield next 控制流程. JS 语言上的协程, 具体实现可以看 babel 的转换代码, v8 只是先进行语义分析, 然后生成相应的 generator 函数, 逻辑和 babel 一样. 因为其中涉及到了具体代码, 所以无法写出公共函数, 总之是一种语言逻辑转换, 通过死循环和 switch 返回结果来实现代码的挂起和执行
- async/await 异步代码 ”同步“ 化的一个语法糖, 相对于 generator 有更好的语义
- Rxjs 坦克

# Promise

它有三个状态，Pending、Fulfilled 和 Rejected。一旦状态发生改变就不能进行修改。
工作流程，通过构造函数初始化 Promise 状态（pending），立即执行 Promise 中传入的 fn 函数，将 Promise 内部 resolve、reject 函数作为参数传递给 fn，等 fn 去控制状态改变后再进行处理。
Promise 难点在 then 方法，每一个 then 都接受两个参数并且返回一个新的 Promise，同时会根据前一个 promise 的状态来处理这个新的 promise，如果是正在 pending 那么就存起来等状态变了再执行有点像观察者模式，如果是其他两个，那么就直接执行。

all\allSettled\any\race

# IntersectionObserver

```js
const io = new IntersectionObserver(callback, option)
io.observe
io.unobserve
io.disconnect
```

time：可见性发生变化的时间，是一个高精度时间戳，单位为毫秒
target：被观察的目标元素，是一个 DOM 节点对象
rootBounds：根元素的矩形区域的信息，getBoundingClientRect()方法的返回值，如果没有根元素（即直接相对于视口滚动），则返回 null
boundingClientRect：目标元素的矩形区域的信息
intersectionRect：目标元素与视口（或根元素）的交叉区域的信息
intersectionRatio：目标元素的可见比例，即 intersectionRect 占 boundingClientRect 的比例，完全可见时为 1，完全不可见时小于等于 0

threshold: 属性决定了什么时候触发回调函数
root 属性，rootMargin 属性

## getComputedStyle

会获取当前元素所有最终使用的 CSS 属性值。会引起回流，因为它需要获取祖先节点的一些信息进行计算（譬如宽高等），所以用的时候慎用，回流会引起性能问题。然后合适的话会将话题引导回流，重绘，浏览器渲染原理等等。

## MessageChannel

## requestAnimationFrame

## Object.prototype.toString.call() 、 instanceof 以及 Array.isArray()

- toString 方法返回 [Object type], 不能保证 toString 没有被修改, 或者 Symbol.toStringTag 被修改
- instanceof 判断左侧对象的原型链中是否存在右侧构造函数的 prototype, 可以修改数组的原型指向来避免
- Array.isArray 具体原理
- [].constructor === Array
- JSON.stringify 以[开头 以]结尾

```js
const fakearray = { length: 0, __proto__: Array.prototype, [Symbol.toStringTag]: 'Array' }
```

## Proxy 支持的拦截操作：

get(target, propKey, receiver)：拦截对象属性的读取，比如 proxy.foo 和 proxy['foo']。
set(target, propKey, value, receiver)：拦截对象属性的设置，比如 proxy.foo = v 或 proxy['foo'] = v，返回一个布尔值。
has(target, propKey)：拦截 propKey in proxy 的操作，返回一个布尔值。
deleteProperty(target, propKey)：拦截 delete proxy[propKey]的操作，返回一个布尔值。
ownKeys(target)：拦截 Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in 循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而 Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
getOwnPropertyDescriptor(target, propKey)：拦截 Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。
defineProperty(target, propKey, propDesc)：拦截 Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
preventExtensions(target)：拦截 Object.preventExtensions(proxy)，返回一个布尔值。
getPrototypeOf(target)：拦截 Object.getPrototypeOf(proxy)，返回一个对象。
isExtensible(target)：拦截 Object.isExtensible(proxy)，返回一个布尔值。
setPrototypeOf(target, proto)：拦截 Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作，比如 proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如 new proxy(...args)

## WebWorker

## ServiceWorker

if ('serviceWorker' in navigator) navigator.serviceWorker.register('/serviceWorker.js')

Service Worker——本质上是充当位于 Web app 与浏览器和网络之间的代理服务器。拦截网络请求\推送通知\后台同步 API

install 事件是 Service Worker 获取的第一个事件，并且只发生一次。传递到 installEvent.waitUntil() 的一个 promise 可表明安装的持续时间以及安装是否成功。接下来需要等 activate 后，才可以收到 fetch 和 push 等事件。默认情况下，不会通过 Service Worker 提取页面，除非页面请求本身需要执行 Service Worker。因此，需要刷新页面以查看 Service Worker 的影响。clients.claim() 可替换此默认值，并提前控制未控制的页面。

触发更新的几种情况：第一次导航到作用域范围内页面的时候、当在 24 小时内没有进行更新检测并且触发功能性时间如 push 或 sync 的时候、SW 的 URL 发生变化并调用.register()时

当 SW 代码发生变化，SW 会做更新（还将包括引入的脚本）
更新后的 SW 会和原始的 SW 共同存在，并运行它的 install。如果新的 SW 不是成功状态，比如 404，解析失败，执行中报错或者在 install 过程中被 reject，它将会被废弃，之前版本的 SW 还是激活状态不变。一旦新 SW 安装成功，它会进入 wait 状态直到原始 SW 不控制任何 clients。self.skipWaiting()可以阻止等待，让新 SW 安装成功后立即激活。

通过句柄手动更新 navigator.serviceWorker.register('/sw.js').then(reg => {reg.update();});

install\Waiting\Activate\skipWaiting

缓存策略：cache-only\network-onlye\Stale while revalidate\Performance\Freshness

# Node.js

## stream 流

Readable、Writable， Duplex 双向， Transform 变化，nodejs 启动的时候会占用内存，一般来说是 2 个 G，当然我们也可以调整内存的大小。但是流因为是调用的外部的模块，所以是可以利用堆外内存的。

createReadStream， 可读流有两个状态 paused 和 flowing。可以把可读流看成内容生产者，不发内容时就是静止态，内容恢复发送时就是流动态。可读流默认处于 paused 态。一旦添加 data 事件监听，它就变为 flowing 态。删掉 data 事件监听，paused 态。pause() 可以将它变为 paused。resume() 可以将它变为 flowing。可以通过 pip 把他传递给 response

createWriteStream ，调用 stream.write(chunk) 的时候，可能会得到 false。false 的意思是你写太快了，积压数据。这个时候我们就不能再 write 了，要监听 drain。等 drain 事件触发了，我们才能继续 write。

在 Stream 中，还有一个非常重要的问题：数据积压。
为什么使用 Stream 呢？因为读写大文件的时候，可以有效降低内存压力。管道 pipe 是 Stream 中的一个重要概念，可以连接流。

## 模块加载机制

一个模块的加载是从 require 语句开始，当 require 一个文件的时候就会将这个文件的内容读取出来，然后包装成一个函数去执行，同时给这个函数注入全局变量比如 moduel/exports/require/dirname/filename 等，执行的过程中文件内部会修改 module.exports 的值，然后将这个值加入到全局缓存中，等下次再 require 的时候就直接从缓存中取值。

加载的时候是有顺序的，先加载内置模块，缓存，对应路径的文件，对应路径的文件夹，最后是 node_modules。

## exports 和 module.exports 的区别

初始状态下，exports === module.exports === {}，exports 是 module.exports 的一个引用。对 module.exports 的重新赋值会作为模块的导出内容，但是你对 exports 的重新赋值并不能改变模块导出内容，只是改变了 exports 这个变量而已，因为模块始终是 module，导出内容是 module.exports

## 循环引用

为了解决循环引用，模块在加载前就会被加入缓存，下次再加载会直接返回缓存，如果这时候模块还没加载完，就可能拿到不完整的 exports
