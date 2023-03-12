- [密钥生成](#密钥生成)
- [测试 ssh 连接](#测试-ssh-连接)
- [ssh 连接异常](#ssh-连接异常)

# 密钥生成

```sh
ssh-keygen -t ed25519 -C "nice.to.meet.wangzi@gmail.com"
cat ~/.ssh/id_ed25519.pub
```

# 测试 ssh 连接

ssh -Tv git@github.com

# ssh 连接异常

1. WSL2 并且使用桥接网卡时, 先更新网卡驱动!!! [intel 驱动更新](https://www.intel.cn/content/www/cn/zh/support/intel-driver-support-assistant.html)

2. Connection closed by ...... port 22

> [ssh 访问 22 端口偶尔失败的相关 issues。](https://github.com/vernesong/OpenClash/issues/1960#issuecomment-1115732292)
> 官方的解决方案：[通过 HTTPS 端口建立 SSH 连接](https://docs.github.com/en/authentication/troubleshooting-ssh/using-ssh-over-the-https-port)

```sh
code ~/.ssh/config

Host github.com
Hostname ssh.github.com
Port 443
User git
```
