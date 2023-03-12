# server component

Server Component 特性：

1. Server Component 是个 React 组件，基于传入的 props 来渲染界面，但是不能使用 state 和 effects，其他和平常的 React 组件没有区别
2. Server Component 具备服务端的能力，比如直接查询 DB、访问文件等
3. Server Component 可以 import Client 组件，为了方便区分，Client 组件以 .client.js 结尾
4. Server Components 不会被打包在 bundle 里，Server Component 里依赖的 npm 也不会

- 通过 webpack 打包编译 src 下的代码，通过 react-server-dom-webpack 插件只打包 Client Components
- 启动 Express 服务，访问页面地址的时候，返回 html 文件
- 页面里的 Client bundle 发起请求，获取首屏内容
- 服务端通过 react-server-dom-webpack 里的 writer 把 Server 组件和 Client 组件序列化为一种特殊的格式，返回给 Client
- Client 拿到响应数据之后，还是通过 react-server-dom-webpack 来进行反序列化，最终进行渲染

与 ssr 完全不是一个东东：

1、SSR 是在服务端把 js 转成 HTML，返回给客户端；而 Server Components 是在客户端渲染的，服务端输出的是 chunks
2、SSR 的请求响应是 HTML，无法保留客户端的状态，而 Server Components 在渲染的时候，是不影响 Client Components 的状态的

1、Server Components 有局限性，比如不能使用 state、effects、以及浏览器的一些 API，适合用在纯展示的组件
2、是 BFF 的一个新思路
