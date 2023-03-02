- [项目构建](#项目构建)
- [webpack](#webpack)
- [有哪些常见的 Loader？你用过哪些 Loader？](#有哪些常见的-loader你用过哪些-loader)
- [有哪些常见的 Plugin？你用过哪些 Plugin？](#有哪些常见的-plugin你用过哪些-plugin)
- [那你再说一说 Loader 和 Plugin 的区别？](#那你再说一说-loader-和-plugin-的区别)
- [Webpack 构建流程简单说一下](#webpack-构建流程简单说一下)
- [source map 是什么？生产环境怎么用？](#source-map-是什么生产环境怎么用)
- [模块打包原理知道吗？](#模块打包原理知道吗)
- [文件监听原理呢？](#文件监听原理呢)
- [说一下 Webpack 的热更新原理吧](#说一下-webpack-的热更新原理吧)
- [如何对 bundle 体积进行监控和分析？](#如何对-bundle-体积进行监控和分析)
- [文件指纹是什么？怎么用？](#文件指纹是什么怎么用)
- [在实际工程中，配置文件上百行乃是常事，如何保证各个 loader 按照预想方式工作？](#在实际工程中配置文件上百行乃是常事如何保证各个-loader-按照预想方式工作)
- [代码分割有什么意义呢？](#代码分割有什么意义呢)
- [聊一聊 Babel 原理吧](#聊一聊-babel-原理吧)
- [rollup](#rollup)
- [vite](#vite)
- [vite devServer 原理](#vite-devserver-原理)
- [NPM 模块安装机制](#npm-模块安装机制)

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
开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译
确定入口：根据配置中的 entry 找出所有的入口文件
编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系
输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。

初始化：启动构建，读取与合并配置参数，加载 Plugin，实例化 Compiler
编译：从 Entry 出发，针对每个 Module 串行调用对应的 Loader 去翻译文件的内容，再找到该 Module 依赖的 Module，递归地进行编译处理
输出：将编译后的 Module 组合成 Chunk，将 Chunk 转换成文件，输出到文件系统中

# source map 是什么？生产环境怎么用？

source map 是将编译、打包、压缩后的代码映射回源代码的一个字典。开启 sourcemap 后，打包好的代码最后面会有一行注释，只要打开控制台，浏览器就会加载 map 文件。
hidden-source-map：借助第三方错误监控平台 Sentry 使用
nosources-source-map：只会显示具体行数以及查看源代码的错误栈。安全性比 sourcemap 高
sourcemap：通过 nginx 设置将 .map 文件只对白名单开放(公司内网)

注意：避免在生产中使用 inline- 和 eval-，因为它们会增加 bundle 体积大小，并降低整体性能。

# 模块打包原理知道吗？

Webpack 实际上自己实现了一个浏览器版本的类似 commonjs 的模块加载机制。为每个模块创造了一个可以导出和导入的环境，本质上并没有修改代码的执行逻辑，代码执行顺序与模块加载顺序也完全一致。最终文件中的模块实现是基于 webpack 自己实现的 webpack_require（es5 代码），所以打包后的文件可以跑在浏览器上。同时以上意味着在 webapck 环境下，你可以只使用 ES6 模块语法书写代码内置了对 ES6、CommonJS、AMD 模块化语句的支持，webpack 会对各种模块进行语法分析，并做转换编译。另外，webpack 还实现了类似 jsonp 的异步模块加载。
遇到异步模块时，使用 webpack_require.e 函数去把异步代码加载进来。该函数会在 html 的 head 中动态增加 script 标签，src 指向指定的异步模块存放的文件。
加载的异步模块文件会执行 webpackJsonpCallback 函数，把异步模块加载到主文件中。所以后续可以像同步模块一样,直接使用 webpack_require("./src/async.js")加载异步模块

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

# rollup

rollup.js 是一个模块打包工具，可以帮助你从一个入口文件开始，将所有使用到的模块文件都打包到一个最终的发布文件中，一般工具库都是使用 rollup 来构建的，像 vue。

rollup.js 有两个重要的特性，其中一个就是它使用 ES6 的模块标准，这意味着你可以直接使用 import 和 export 而不需要引入 babel（当然，在现在的项目中，babel 可以说是必用的工具了）。

rollup.js 的另一个重要特性叫做'tree-shaking'，这个特性可以帮助你将无用代码（即没有使用到的代码）从最终的生成文件中删去。举个例子，我在 A.js 文件中定义了 A1 和 A2 两个方法，同时在 B 文件中引入了这两个方法，但是在 B 文件中只引入了 A 文件中的 A1 方法，那么在最后打包 B 文件时，rollup 就不会将 A2 方法引入到最终文件中。（这个特性是基于 ES6 模块的静态分析的，也就是说，只有 export 而没有 import 的变量是不会被打包到最终代码中的）

# vite

1.  快速冷启动
2.  按需编译、依赖预构建
3.  只对变更代码模块热更新

# vite devServer 原理

利用 ES module 的 script[type=module], import 会发送请求去加载文件的特性, 在 devServer 中拦截请求, 仅针对请求的文件模块进行处理

工作流程

vite development 启动时, 会创建 http 服务、WebSocket 服务、chokidar 监听源码文件, 以及初始化插件, 进行依赖预构建

- http 服务拦截请求

  1. indexHtmlMiddleware 针对 index.html 的请求, 返回处理好的模版内容, 并在模版头部插入 `@vite/client` script
  2. 对于 `/@vite/client` 请求返回 WS client 脚本代码, 用来负责与 WebSocket 通信和热更新
  3. 对于 源代码请求,

- WebSocket 服务

  1. 文件变动后调用的 handleHMRUpdate 中 server 端向 client 端发送更新内容
  2. client 端在接收到更新时执行对应的操作
     - reload
     - 使用 import 语句重新导入热更新的模块 import(url + timestamp)

- chokidar

  1. 创建 watcher 实例监听项目文件
  2. 当 watcher.on('change', cb) 时调用

  - moduleGraph.onFileChange(file) 使模块依赖中的对应文件失效
  - handleHMRUpdate 与 `@vite/client` 客户端代码进行通信

- 依赖预构建，缓存机制

  1. 在 devServer 启动后, 扫描项目模块中的 dependence 依赖模块, 并提前进行打包, 存储到 .vite 目录中
  2. 什么时候重新构建缓存？ `_metadata.json`, 将 dependence、lock 文件、vite.config 生成 content_hash, 当 hash 不一致时重新打包
  3. 统一处理 CommonJS、UMD 转成 ESM

- ModuleGraph 模块依赖图

  ```ts
  ModuleNode {
    url: string // 相对于 root 路径的地址
    id: string // 唯一标识, 经过转换后的地址
    file: string // 文件绝对地址, id 去掉 search、hash
    type: 'js' | 'css' // 模块类型
    importers: Set<ModuleNode> // 被哪些模块依赖
    importedModules: Set<ModuleNode> // 依赖了哪些模块
    acceptedHmrDeps: Set<ModuleNode> // hmr accepted 接受了哪些模块
    transformResult // 模块转换后的结果
  }

  ```

# NPM 模块安装机制

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
