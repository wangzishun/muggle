- [项目构建](#项目构建)
- [webpack](#webpack)
- [有哪些常见的 Loader？你用过哪些 Loader？](#有哪些常见的-loader你用过哪些-loader)
- [有哪些常见的 Plugin？你用过哪些 Plugin？](#有哪些常见的-plugin你用过哪些-plugin)
- [那你再说一说 Loader 和 Plugin 的区别？](#那你再说一说-loader-和-plugin-的区别)
- [Webpack 构建流程简单说一下](#webpack-构建流程简单说一下)
- [模块打包原理知道吗？](#模块打包原理知道吗)
- [source map 是什么？生产环境怎么用？](#source-map-是什么生产环境怎么用)
- [文件监听原理呢？](#文件监听原理呢)
- [说一下 Webpack 的热更新原理吧](#说一下-webpack-的热更新原理吧)
- [如何对 bundle 体积进行监控和分析？](#如何对-bundle-体积进行监控和分析)
- [文件指纹是什么？怎么用？](#文件指纹是什么怎么用)
- [在实际工程中，配置文件上百行乃是常事，如何保证各个 loader 按照预想方式工作？](#在实际工程中配置文件上百行乃是常事如何保证各个-loader-按照预想方式工作)
- [代码分割有什么意义呢？](#代码分割有什么意义呢)
- [聊一聊 Babel 原理吧](#聊一聊-babel-原理吧)
- [plugin 插件](#plugin-插件)
- [loader](#loader)

# 项目构建

1. 代码转换, 把 ts、less、sass、vue、jsx、tsx 编译 js、css、html
2. 代码优化, 删除无用的代码、注释、log, 压缩代码体积
3. 代码分割
4. 模块合并
5. 自动刷新
6. 代码校验
7. 自动发布

# webpack

一切皆模块, 通过 loader 转换文件, 通过 plugin 注入钩子, 输出由多个模块组合的文件

webpack 是模块化管理工具和打包工具，会自动递归解析入口所需要加载的所有资源文件，然后用不同 Loader 来处理不同的文件，用 Plugin 来扩展 webpack 功能。
webpack 是一个 模块打包工具，可以使用 webpack 管理模块依赖，并编译输出模块们所需的静态文件。它能管理、打包 HTML、JS、CSS 以及各种静态文件（图片、字体等）。对于不同类型的资源有对应的模块加载器 loader。 webpack 模块打包器会分析模块间的依赖关系，最后生成了优化合并后的静态资源。

Entry：编译入口，webpack 编译的起点
Compiler：编译管理器，webpack 启动后会创建 compiler 对象，该对象一直存活知道结束退出
Compilation：单次编辑过程的管理器，比如 watch = true 时，运行过程中只有一个 compiler 但每次文件变更触发重新编译时，都会创建一个新的 compilation 对象
Dependence：依赖对象，webpack 基于该类型记录模块间依赖关系
Module：webpack 内部所有资源都会以“module”对象形式存在，所有关于资源的操作、转译、合并都是以 “module” 为基本单位进行的
Chunk：编译完成准备输出时，webpack 会将 module 按特定的规则组织成一个一个的 chunk，这些 chunk 某种程度上跟最终输出一一对应
Loader：资源内容转换器，其实就是实现从内容 A 转换 B 的转换器
Plugin：webpack 构建过程中，会在特定的时机广播对应的事件，插件监听这些事件，在特定时间点介入编译过程

# 有哪些常见的 Loader？你用过哪些 Loader？

url-loader：与 file-loader 类似，区别是用户可以设置一个阈值，大于阈值会交给 file-loader 处理，小于阈值时返回文件 base64 形式编码 (处理图片和字体)
image-loader：加载并且压缩图片文件
babel-loader：把 ES6 转换成 ES5
ts-loader: 将 TypeScript 转换成 JavaScript
sass-loader：将 SCSS/SASS 代码转换成 CSS
css-loader：加载 CSS，支持模块化、压缩、文件导入等特性
postcss-loader：扩展 CSS 语法，使用下一代 CSS，可以配合 autoprefixer 插件自动补齐 CSS3 前缀
vue-loader：加载 Vue.js 单文件组件

# 有哪些常见的 Plugin？你用过哪些 Plugin？

html-webpack-plugin：简化 HTML 文件创建 (依赖于 html-loader)
mini-css-extract-plugin: 分离样式文件，CSS 提取为独立文件，支持按需加载 (替代 extract-text-webpack-plugin)
webpack-bundle-analyzer: 可视化 Webpack 输出文件的体积 (业务组件、依赖第三方模块)

# 那你再说一说 Loader 和 Plugin 的区别？

Loader 本质就是一个函数，在该函数中对接收到的内容进行转换，返回转换后的结果。负责对资源进行转译工作。
Plugin 就是插件，基于事件流框架 Tapable，可以扩展 Webpack 的功能，在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。
Loader 在 module.rules 中配置，作为模块的解析规则，类型为数组。每一项都是一个 Object，内部包含了 test(类型文件)、loader、options (参数)等属性。
Plugin 在 plugins 中单独配置，类型为数组，每一项是一个 Plugin 的实例，参数都通过构造函数传入。

# Webpack 构建流程简单说一下

初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数
创建编译器对象：初始化 Compiler 对象，加载插件，执行对象的 run 方法开始执行编译，每次编译都会有一个新的 compilition 对象来对应本次编译过程。new WebpackOptionsApply().process 加载各种内置插件：EntryOptionPlugin、sourcemap、RuntimePlugin

确定入口：EntryPlugin 插件根据配置的 entry 找出所有的入口文件，调用 compilition.addEntry 将入口文件转换为 dependence 对象
编译模块(make)：根据 entry 对应的 dependence 创建 module 对象，调用 loader 将模块进行转译，再解析这个模块拿到 AST 对象分析该模块的依赖，然后对所有依赖的模块再次执行这个操作，直到所有依赖的文件都经过处理。这个过程就是从 module => ast => dependences => module
完成模块编译：翻译完所有模块后，得到了每个模块的最终内容以及它们之间的依赖关系。
输出资源(seal)：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
输出完成(emitAssets)：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。

初始化：启动构建，读取与合并配置参数，加载 Plugin，实例化 Compiler
编译：从 Entry 出发，针对每个 Module 串行调用对应的 Loader 去翻译文件的内容，再找到该 Module 依赖的 Module，递归地进行编译处理
输出：将编译后的 Module 组合成 Chunk，将 Chunk 转换成文件，输出到文件系统中

构建本次编译的 ChunkGraph 对象；遍历 compilation.modules 集合，将 module 按 entry/动态引入 的规则分配给不同的 Chunk 对象；compilation.modules 集合遍历完毕后，得到完整的 chunks 集合对象，调用 createXxxAssets 方法遍历 module/chunk ，调用 compilation.emitAssets 方法将资 assets 信息记录到 compilation.assets 对象中。触发 seal 回调，控制流回到 compiler 对象。这一步的关键逻辑是将 module 按规则组织成 chunks ，webpack 内置的 chunk 封装规则比较简单：entry 及 entry 触达到的模块，组合成一个 chunk；使用动态引入语句引入的模块，各自组合成一个 chunk

compiler.make 阶段：entry 文件以 dependence 对象形式加入 compilation 的依赖列表，dependence 对象记录有 entry 的类型、路径等信息。根据 dependence 调用对应的工厂函数创建 module 对象，之后读入 module 对应的文件内容，调用 loader-runner 对内容做转化，转化结果若有其它依赖则继续读入依赖资源，重复此过程直到所有依赖均被转化为 module
compilation.seal 阶段：遍历 module 集合，根据 entry 配置及引入资源的方式，将 module 分配到不同的 chunk。遍历 chunk 集合，调用 compilation.emitAsset 方法标记 chunk 的输出规则，即转化为 assets 集合。
compiler.emitAssets 阶段：将 assets 写入文件系统

# 模块打包原理知道吗？

Webpack 实际上自己实现了一个浏览器版本的类似 commonjs 的模块加载机制。为每个模块创造了一个可以导出和导入的环境，本质上并没有修改代码的执行逻辑，代码执行顺序与模块加载顺序也完全一致。最终文件中的模块实现是基于 webpack 自己实现的 webpack_require（es5 代码），所以打包后的文件可以跑在浏览器上。同时以上意味着在 webapck 环境下，你可以只使用 ES6 模块语法书写代码内置了对 ES6、CommonJS、AMD 模块化语句的支持，webpack 会对各种模块进行语法分析，并做转换编译。另外，webpack 还实现了类似 jsonp 的异步模块加载。
遇到异步模块时，使用 webpack_require.e 函数去把异步代码加载进来。该函数会在 html 的 head 中动态增加 script 标签，src 指向指定的异步模块存放的文件。
加载的异步模块文件会执行 webpackJsonpCallback 函数，把异步模块加载到主文件中。所以后续可以像同步模块一样,直接使用 webpack_require("./src/async.js")加载异步模块

从开发者提供的 entry 开始递归地组建起包含所有模块的 dependency graph，之后再将这些 module 打包为 bundles。

Module：资源在 webpack 内部的映射对象，包含了资源的路径、上下文、依赖、内容等信息
Dependency ：在模块中引用其它模块，对应 import 语句，webpack 会先将引用关系表述为 Dependency 子类并关联 module 对象，等到当前 module 内容都解析完毕之后，启动下次循环开始将 Dependency 对象转换为适当的 Module 子类。
Chunk ：用于组织输出结构的对象，webpack 分析完所有模块资源的内容，构建出完整的 Dependency Graph 之后，会根据用户配置建出一个或多个 chunk 包，每个 chunk 与最终输出的文件大致上是一一对应的。

# source map 是什么？生产环境怎么用？

source map 是将编译、打包、压缩后的代码映射回源代码的一个字典。开启 sourcemap 后，打包好的代码最后面会有一行注释，只要打开控制台，浏览器就会加载 map 文件。
hidden-source-map：借助第三方错误监控平台 Sentry 使用
nosources-source-map：只会显示具体行数以及查看源代码的错误栈。安全性比 sourcemap 高
sourcemap：通过 nginx 设置将 .map 文件只对白名单开放(公司内网)

注意：避免在生产中使用 inline- 和 eval-，因为它们会增加 bundle 体积大小，并降低整体性能。

# 文件监听原理呢？

轮询判断文件的最后编辑时间是否变化，初次构建时把文件的修改时间储存起来，下次有修改时会和上次修改时间比对，发现不一致的时候，并不会立刻告诉监听者，而是先缓存起来，等 aggregateTimeout 后，把变化列表一起构建，并生成到 bundle 文件夹

# 说一下 Webpack 的热更新原理吧

HMR。 这个机制可以做到不用刷新浏览器而将新变更的模块替换掉旧的模块。
HMR 的核心就是客户端从服务端拉去更新后的文件，准确的说是 chunk diff (chunk 需要更新的部分)，webpackdevserver 与浏览器之间维护了一个 Websocket，当本地资源发生变化时，WDS 会向浏览器推送更新，并带上构建时的 hash，让客户端与上一次资源进行对比。客户端对比出差异后会向 WDS 发起 Ajax 请求来获取更改内容(文件列表、hash)，这样客户端就可以再借助这些信息继续向 WDS 发起 jsonp 请求获取该 chunk 的增量更新。
后续的部分(拿到增量更新之后如何处理？哪些状态该保留？哪些又需要更新？)由 HotModulePlugin 来完成，提供了相关 API 以供开发者针对自身场景进行处理，像 react-hot-loader 和 vue-loader 都是借助这些 API 实现 HMR。
细节请参考 Webpack HMR 原理解析

# 如何对 bundle 体积进行监控和分析？

VSCode 中有一个插件 Import Cost 可以帮助我们对引入模块的大小进行实时监测，还可以使用 webpack-bundle-analyzer 生成 bundle 的模块组成图，显示所占体积。

# 文件指纹是什么？怎么用？

文件指纹是打包后输出的文件名的后缀。 output.filename: '[name][chunkhash:8].js',
Hash：和整个项目的构建相关，只要项目文件有修改，整个项目构建的 hash 值就会更改
Chunkhash：和 Webpack 打包的 chunk 有关，不同的 entry 会生出不同的 chunkhash
Contenthash：根据文件内容来定义 hash，文件内容不变，则 contenthash 不变

# 在实际工程中，配置文件上百行乃是常事，如何保证各个 loader 按照预想方式工作？

可以使用 enforce 强制执行 loader 的作用顺序，pre 代表在所有正常 loader 之前执行，post 是所有 loader 之后执行。(inline 官方不推荐使用)

# 代码分割有什么意义呢？

代码分割的本质其实就是在源代码直接上线和打包成唯一脚本 main.bundle.js 这两种极端方案之间的一种更适合实际场景的中间状态。
源代码直接上线：虽然过程可控，但是 http 请求多，性能开销大。
打包成唯一脚本：一把梭完自己爽，服务器压力小，但是页面空白期长，用户体验不好。

代码分割（splitChunk）的意义：复用的代码抽离到公共模块中，解决代码冗余;公共模块再按照使用的页面多少（或其他思虑）进一步拆分，用来减小文件体积，顺便优化首屏加载速度

# 聊一聊 Babel 原理吧

解析：将代码转换成 AST; 词法分析：将代码(字符串)分割为 token 流，即语法单元成的数组;语法分析：分析 token 流(上面生成的数组)并生成 AST
转换：遍历 AST 的节点进行变换操作生产新的 AST
生成：以新的 AST 为基础生成代码
总的来说就是通过词法分析和语法分析将 js 代码转换成 AST，然后对抽象语法树进行遍历，对每个节点进行转换，最后将抽象语法树转换成 js 代码。

解析阶段：调用 babel/parse 进行词法分析（对输入的字符做标记处理）和语法分析（处理标记与标记之间的关系）， 生成 AST
转换阶段：调用 babel/traverse 对 AST 进行深度优先遍历，调用插件，按需对节点进行增删改的操作
生成阶段：调用 babel/gengerate 将 AST 转换成 js 代码字符串

# plugin 插件

class.apply 函数运行时会得到参数 compiler ，以此为起点可以调用 hook 对象注册各种钩子回调，例如： compiler.hooks.make.tapAsync ，这里面 make 是钩子名称，tapAsync 定义了钩子的调用方式，webpack 的插件架构基于这种模式构建而成，插件开发者可以使用这种模式在钩子回调中，插入特定代码。webpack 各种内置对象都带有 hooks 属性，比如 compilation 对象

SyncHook, SyncBailHook, SyncWaterfallHook, SyncLoopHook, AsyncParallelHook, AsyncParallelBailHook, AsyncSeriesHook, AsyncSeriesBailHook, AsyncSeriesWaterfallHook

compiler.hooks.compilation ：时机：启动编译创建出 compilation 对象后触发;compiler.hooks.make：时机：正式开始编译时触发
compilation.hooks.optimizeChunks ：时机： seal 函数中，chunk 集合构建完毕后触发;参数：chunks 集合与 chunkGroups 集合;示例： SplitChunksPlugin 插件基于此钩子实现 chunk 拆分优化
compiler.hooks.done：时机：编译完成后触发;参数： stats 对象，包含编译过程中的各类统计信息;示例： webpack-bundle-analyzer 插件基于此钩子实现打包分析

compilation.addModule：添加模块，可以在原有的 module 构建规则之外，添加自定义模块
compilation.emitAsset：直译是“提交资产”，功能可以理解将内容写入到特定路径
compilation.addEntry：添加入口，功能上与直接定义 entry 配置相同
module.addError：添加编译错误信息

# loader

vue-loader

1. Vue SFC 文件包含多种格式的内容：style、script、template 以及自定义 block，vue-loader 如何分别处理这些内容？
   在 vue-loader 中，给原始文件路径增加不同的参数，后续配合 resourceQuery 函数就可以分开处理这些内容，这样的实现相比于一次性处理，逻辑更清晰简洁，更容易理解

2. 针对不同内容块，vue-loader 如何复用其他 loader？比如针对 less 定义的 style 块，vue-loader 是怎么调用 less-loader 加载内容的？
   经过 normal loader、pitcher loader 两个阶段后，SFC 内容会被转化为 import xxx from '!-babel-loader!vue-loader?xxx' 格式的引用路径，以此复用用户配置。

3. 此外，从 vue-loader 可以学到一些 webpack 插件、loader 的套路：
   可以在插件中动态修改 webpack 的配置信息
   Loader 并不一定都要实实在在的处理文件的内容，也可以是返回一些更具体，更有指向性的新路径，以复用 webpack 的其他模块
   灵活使用 resourceQuery ，能够在 loader 中更精准地命中特定路径格式
