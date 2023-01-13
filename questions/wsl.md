# WSL

# wsl 启用代理, 使 wsl 中的请求都走宿主的代理服务

```bash
# proxy start 获取宿主IP, 导出全局变量
# host_ip=$(cat /etc/resolv.conf |grep "nameserver" |cut -f 2 -d " ")
host_ip=192.168.3.31

export http_proxy="http://$host_ip:10811"
export https_proxy="http://$host_ip:10811"
export all_proxy="http://$host_ip:10811"
# proxy end
```
