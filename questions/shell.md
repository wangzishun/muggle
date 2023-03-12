- [Bash 获取 git 当前的分支名](#bash-获取-git-当前的分支名)
- [ls](#ls)
- [cd](#cd)
- [pwd 显示当前目录](#pwd-显示当前目录)
- [mkdir rmdir](#mkdir-rmdir)
- [cp](#cp)
- [mv](#mv)
- [rm 删除文件](#rm-删除文件)
- [du 查看目录大小](#du-查看目录大小)
- [grep](#grep)
- [xargs](#xargs)
- [chmod](#chmod)
- [ps](#ps)
- [echo](#echo)
- [kill](#kill)
- [find](#find)
- [less](#less)
- [cat](#cat)
- [tail](#tail)
- [telnet](#telnet)
- [lsof](#lsof)

# Bash 获取 git 当前的分支名

git rev-parse --abbrev-ref HEAD
git symbolic-ref --short -q HEAD

# ls

ls -l 更详细的信息
ls -a 显示所有文件，包括隐藏文件
ls -F 显示文件类型

# cd

# pwd 显示当前目录

# mkdir rmdir

mkdir -p a/b/c 创建多级目录

# cp

cp a b 复制文件 a 到 目录 b
cp -r a b 复制目录 a 到 目录 b

# mv

mv a b 移动文件 a 到 目录 b
mv a b 重命名文件 a 为 b
mv a ../c/b 移动文件 a 到上一级目录 c 中并重命名为 b

# rm 删除文件

rm -r 递归删除目录
rm -f 强制删除
rm -i 删除前提示

# du 查看目录大小

du -sh 查看当前目录大小

# grep

1. ls | grep a 查找当前目录下所有文件名中包含 a 的文件
2. env | grep http 查看包含 http 的环境变量

# xargs

ls | grep a | xargs rm 删除当前目录下所有文件名中包含 a 的文件

# chmod

chmod 777 a.txt 修改文件 a.txt 的权限为 777

# ps

# echo

# kill

# find

# less

# cat

# tail

# telnet

# lsof

1. lsof -i:8001 查看 8001 端口占用
