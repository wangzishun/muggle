- [zsh](#zsh)
- [nvm](#nvm)
- [pnpm](#pnpm)
  - [常用的全局工具](#常用的全局工具)
- [yarn](#yarn)
- [git](#git)
- [windows wsl](#windows-wsl)
  - [wsl 桥接网卡](#wsl-桥接网卡)
  - [WSL 代理配置，放到 .zshrc](#wsl-代理配置放到-zshrc)

# zsh

```sh
apt install zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

# nvm

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

nvm install --lts
nvm install 18
nvm install 16
nvm install 12
```

# pnpm

```sh
curl -fsSL https://get.pnpm.io/install.sh | sh -

# 在 .zshrc 中添加别名并验证 alias pn=pnpm
echo alias pn="pnpm" >> ~/.zshrc
cat ~/.zshrc | grep 'alias pn=pnpm'
```

## 常用的全局工具

```sh
# whistle
pn add -g whistle
```

# yarn

```sh
curl -o- -L https://yarnpkg.com/install.sh | bash
```

# git

```sh
ssh-keygen -t ed25519 -C "nice.to.meet.wangzi@gmail.com"
cat .ssh/id_ed25519.pub
```

# windows wsl

## wsl 桥接网卡

```sh
# %USERPROFILE%\.wslconfig
[wsl2]
networkingMode=bridged
vmSwitch=WSL
ipv6=true

# 或者运行命令
echo [wsl2] > %USERPROFILE%\.wslconfig
echo networkingMode=bridged >> %USERPROFILE%\.wslconfig
echo nvmSwitch=WSLBridge >> %USERPROFILE%\.wslconfig
echo ipv6=true >> %USERPROFILE%\.wslconfig

# 重启
wsl --shutdown && wsl
```

1. `Get-NetAdapter` 获取所有的网卡信息，记录想要桥接到的网卡，例如 WLAN、Wi-Fi 或 Ethernet 等等
2. 使用 hyper-v 管理器将 WSL 使用的网卡桥接到目标网卡之上（建议手动操作 hyper-v 管理器，不建议的命令：Set-VMSwitch WSL -NetAdapterName WLAN）

## WSL 代理配置，放到 .zshrc

```sh
# 代理配置
proxy_address="http://192.168.3.34:10811"
# proxy_address="socks://192.168.3.34:10810"

# export all_proxy=$proxy_address
export http_proxy=$proxy_address
export https_proxy=$proxy_address

# 测试代理
curl -vv https://google.com
```
