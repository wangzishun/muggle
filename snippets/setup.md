# tools

[vscode](https://code.visualstudio.com/download)
[git](https://git-scm.com/downloads)

[chrome](https://www.google.com/chrome/)
[bandizip](https://www.bandisoft.com/bandizip/)
[v2rayN](https://github.com/2dust/v2rayN)

# zsh & onmyzsh

apt install zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# nvm

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

nvm install --lts
nvm install 18
nvm install 16
nvm install 12

# pnpm

curl -fsSL https://get.pnpm.io/install.sh | sh -
echo alias pn="pnpm" >> ~/.zshrc

## whistle

pn add whistle -g

# yarn

curl -o- -L https://yarnpkg.com/install.sh | bash

# git

ssh-keygen -t ed25519 -C "nice.to.meet.wangzi@gmail.com"
cat .ssh/id_ed25519.pub

# windows wsl

## wsl 桥接

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

## 获取所有的网卡信息，记录想要桥接到的网卡，例如 WLAN、Wi-Fi 或 Ethernet 等等

Get-NetAdapter

## 将 WSL 使用的网卡桥接到 WLAN 这个网卡之上

优先使用 hyper-v 管理器
Set-VMSwitch WSL -NetAdapterName WLAN

## WSL 代理配置，放到 .zshrc

```sh
# 代理配置
proxy_address="http://192.168.3.34:10811"
# export all_proxy=$proxy_address
export http_proxy=$proxy_address
export https_proxy=$proxy_address

# 测试代理
curl -vv https://google.com
```
