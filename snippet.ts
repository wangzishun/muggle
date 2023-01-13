enum Operations {
  create = 0, // 创建
  edit = 1, // 编辑
  delete = 2, // 删除
  detail = 3, // 详情
  download = 4, // 下载
  export = 5, // 导出
  import = 6, // 导入
  open = 7, // 打开
  close = 8, // 关闭
  activated = 9, // 激活
  deactivated = 10, // 停用
  adopt = 11, // 接收
  reject = 12, // 拒绝
}

// fundPoolManagement: {
//   reviewRefund: { // 补退款审核
//       edit: '31-1-2-1',

type WithOperation<T> = T & Operations

type Foo = () => void

type PermissionTypes = {
  fundpool: Foo & { reviewrefund: Foo }
}

type FakeDummy = PermissionTypes & { stack: string[] }

const dummy = function () {}
dummy.stack = []

const mappings = new Map()

const permissions: PermissionTypes = new Proxy(dummy as unknown as FakeDummy, {
  get: (target, key: string, receiver) => {
    target.stack.push(key)

    return permissions
  },
  apply: (target, thisArgs, argArray) => {
    const path = target.stack.slice()

    target.stack.length = 0

    console.log(path)
    console.log(target.stack)
  },
})

permissions.fundpool.reviewrefund()
