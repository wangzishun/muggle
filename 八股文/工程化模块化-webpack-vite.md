# commonJS

1. 运行时加载。module.exports 属性需要模块执行过后才有
2. 输出的是值的拷贝, 换句话来说, 一旦导出一个值, 那么模块内部的变化无法影响这个值
3. 通过 require 同步加载, 加载完成后才能执行后面的操作。

# ES module

1. 对外接口是一种静态定义, 代码静态解析阶段就会生成
2. 输出的是值的引用, 动态引用。JS 引擎在对脚本进行静态分析时, 遇到 import 语句时会生成一个只读引用, 等到脚本执行时根据只读引用去取值
3. import 当作函数时可以异步加载, 有一个独立的模块依赖解析阶段

# 项目构建

1. 代码转换, 把 ts、less、sass、vue、jsx、tsx 编译 js、css、html
2. 代码优化, 删除无用的代码、注释、log, 压缩代码体积
3. 代码分割
4. 模块合并
5. 自动刷新
6. 代码校验
7. 自动发布

# webpack 一切皆模块, 通过 loader 转换文件, 通过 plugin 注入钩子, 输出由多个模块组合的文件

# 优势

1. 快速冷启动
2. 按需编译、依赖预构建
3. 只对变更代码模块热更新

# devServer 原理

利用 ES module 的 script[type=module], import 会发送请求去加载文件的特性, 在 devServer 中拦截请求, 仅针对请求的文件模块进行处理

# 工作流程

vite development 启动时, 会创建 http 服务、WebSocket 服务、chokidar 监听源码文件, 以及初始化插件, 进行依赖预构建

## http 服务拦截请求

1. indexHtmlMiddleware 针对 index.html 的请求, 返回处理好的模版内容, 并在模版头部插入 `@vite/client` script
2. 对于 `/@vite/client` 请求返回 WS client 脚本代码, 用来负责与 WebSocket 通信和热更新
3. 对于 源代码请求,

## WebSocket 服务

1. 文件变动后调用的 handleHMRUpdate 中 server 端向 client 端发送更新内容
2. client 端在接收到更新时执行对应的操作
   - reload
   - 使用 import 语句重新导入热更新的模块 import(url + timestamp)

## chokidar

1. 创建 watcher 实例监听项目文件
2. 当 watcher.on('change', cb) 时调用
   - moduleGraph.onFileChange(file) 使模块依赖中的对应文件失效
   - handleHMRUpdate 与 `@vite/client` 客户端代码进行通信

## 依赖预构建

1. 在 devServer 启动后, 扫描项目模块中的 dependence 依赖模块, 并提前进行打包, 存储到 .vite 目录中
2. 重新构建, `_metadata.json`, 将 dependence、lock 文件、vite.config 生成 content_hash, 当 hash 不一致时重新打包
3. 统一处理 CommonJS、UMD 转成 ESM

## ModuleGraph 模块依赖图

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
