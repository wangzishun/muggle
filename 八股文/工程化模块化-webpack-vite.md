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

1. 快速冷启动
2. 按需编译、依赖预构建
3. 只对变更代码模块热更新

## vite devServer 原理

利用 ES module 的 script[type=module], import 会发送请求去加载文件的特性，在 devServer 中拦截请求，仅针对请求的文件模块进行处理

## vite 工作流程

vite development 启动时，会创建 http 服务、WebSocket 服务、chokidar 监听源码文件，以及初始化插件，进行依赖预构建

## vite http 服务拦截请求

1. indexHtmlMiddleware 针对 index.html 的请求，返回处理好的模版内容，并在模版头部插入 `@vite/client` script
2. 对于 `/@vite/client` 请求返回 WS client 脚本代码, 用来负责与 WebSocket 通信和热更新
3. 对于 源代码请求,

## vite WebSocket 服务

1. 文件变动后调用的 handleHMRUpdate 中 server 端向 client 端发送更新内容
2. client 端在接收到更新时执行对应的操作
   - reload
   - 使用 import 语句重新导入热更新的模块 import(url + timestamp)

## vite chokidar

1. 创建 watcher 实例监听项目文件
2. 当 watcher.on('change', cb) 时调用
   - moduleGraph.onFileChange(file) 使模块依赖中的对应文件失效
   - handleHMRUpdate 与 `@vite/client` 客户端代码进行通信

## vite 依赖预构建

1. 在 devServer 启动后，扫描项目模块中的 dependence 依赖模块，并提前进行打包，存储到 .vite 目录中
2. 重新构建, `_metadata.json`, 将 dependence、lock 文件、vite.config 生成 content_hash, 当 hash 不一致时重新打包
3. 统一处理 CommonJS、UMD 转成 ESM

## vite ModuleGraph 模块依赖图

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
