# question

1. 使用 pnpm 报错, RN 项目直接使用 symlinks 有问题。 [facebook/metro#1](https://github.com/facebook/metro/issues/1)

- 解决: .npmrc 添加 node-linker=hoisted
