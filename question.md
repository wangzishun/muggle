# WSL

1. WSL 中启用 whilst 代理服务，局域网手机无法访问到代理

https://learn.microsoft.com/zh-cn/windows/wsl/networking
https://www.cnblogs.com/maomaozi/p/14587469.html

```shell
# 设置端口转发
netsh interface portproxy add v4tov4 listenport=8899 listenaddress=0.0.0.0 connectport=8899 connectaddress=172.20.254.119

# 撤销命令
netsh interface portproxy delete v4tov4 listenport=19000 listenaddress=192.168.3.31

# 查看转发配置
netsh interface portproxy show all
```


netsh interface portproxy add v4tov4 listenport=19000 listenaddress=192.168.3.31 connectport=19000 connectaddress=172.20.254.119
netsh interface portproxy add v4tov4 listenport=19000 listenaddress=192.168.3.31 connectport=19000 connectaddress=172.20.254.119
netsh interface portproxy add v4tov4 listenport=19000 listenaddress=192.168.3.31 connectport=19000 connectaddress=172.20.254.119

netsh interface portproxy add v4tov4 listenport=4000 listenaddress=0.0.0.0 connectport=4000 connectaddress=192.168.101.100

# windows 端口转发命令
```sh

netsh interface portproxy

```
