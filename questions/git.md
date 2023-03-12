- [密钥生成](#密钥生成)
- [测试 ssh 连接](#测试-ssh-连接)
- [ssh 连接异常](#ssh-连接异常)

# 密钥生成

1. ssh-keygen -t ed25519 -C "nice.to.meet.wangzi@gmail.com"
2. cat .ssh/id_ed25519.pub

# 测试 ssh 连接

ssh -Tv git@github.com

# ssh 连接异常

1. debug1: expecting SSH2_MSG_KEX_ECDH_REPLY
