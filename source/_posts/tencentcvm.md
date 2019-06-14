---
title: 腾讯Ubuntu云服务器环境初始配置
categories: 全栈
abbrlink: aa43c23f
date: 2019-03-10 11:54:16
tags:
thumbnail: https://cdn.nlark.com/yuque/0/2019/jpeg/172796/1559115407818-assets/web-upload/5f1d9f7c-84b4-42ca-ba20-8f78d6b7325a.jpeg
---

## 一、配置 root 登陆

> 腾讯 Ubuntu 云服务器默认用户`ubuntu` ，又懒得 每次都输 `sudo` ，所以加上 `root` 用户

### 1. 设置 root 密码

先使用 ubuntu 用户 ssh 登录腾讯云，然后执行命令

```bash
sudo passwd root
```

### 2. 修改 ssh 登录的配置

`/etc/ssh/sshd_config`文件，修改为允许 root 登录，可以执行命令

```bash
sudo vim /etc/ssh/sshd_config
```

**注意：这里的 sudo 前缀不可少，否则接下来的修改无法保存。进入 vim 编辑，用方向键向下滚动找到 PermitRootLogin 这项**
按下 `insert` 键进入插入模式，将 `PermitRootLogin` 后面的 `prohibit-password` 改为 `yes`，再按下 `Esc` 键，然后依次按下`:`键(英文冒号键)、`w` 键和 `q` 键，最后按下回车键，保存修改成功。

### 3. 重启 ssh 服务

```bash
sudo service ssh restart
```

使刚才的 ssh 配置的修改生效，执行命令

### 使用 root 用户登录

使用`root`用户登录 必要的话 可以删除`ubuntu` 用户

删除命令：

```bash
userdel -r ubuntu
```

## 二、安装 docker 及 docker-compose

### docker

最方便的方法是使用官方脚本并使用阿里云镜像安装

```
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
```

如果您想将 `Docker` 用作非 `root` 用户，您现在应该考虑将您的用户添加到“docker”组，例如：
可以自行添加用户 （尽量避免使用`docker`作为用户名）

```bash
useradd your-user
```

```bash
sudo usermod -aG docker your-user
```

请记得注销并重新登录才能生效！

### docker-compose

#### 1. 运行脚本

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

**其中 1.24.0 可以切换你想安装的版本**

#### 2. 对二进制文件应用可执行权限：

```
sudo chmod +x /usr/local/bin/docker-compose
```

> 注意：如果 docker-compose 安装后命令失败，请检查您的路径。您还可以创建/usr/bin 路径中的符号链接或任何其他目录。 例如：

```bash
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

#### 3. 测试安装。

```bash
docker-compose --version
```

#### 4. 卸载:

```bash
sudo rm /usr/local/bin/docker-compose
```

## 三、安装 Nginx

因为是`ubuntu` 系统 不像 `centos` ,`ubuntu` 的包都比较新 所以直接用包管理器安装

```bash
apt-get update
apt-get install nginx
```

完成之后 `nginx -v` 打印出版本号就说明安装成功了

## 四、安装 Node.js

因为每个项目可能依赖的 Node 版本不同 这里选用了 `nvm` 来作为 node 的包管理器 ，它可以方便的在同一台设备上进行多个 node 版本之间切换

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
```

**注意：在 Linux 上，运行安装脚本后，如果 `nvm: command not found` 在键入后收到或看不到终端的反馈：**

```
command  -v nvm
```

只需关闭当前终端，打开新终端，然后再次尝试 `nvm -v`验证。

验证成功后就可以安装`node.js`了

### nvm 用法

要下载，编译和安装最新版本的节点，请执行以下操作：

```bash
nvm install node # node是最新版本的别名
```

要安装特定版本的节点：

```bash
nvm install 6.14.4 # 10.10.0,8.9.1 等
```

您可以使用 ls-remote 列出可用版本：

```bash
nvm ls-remote
```

然后在任何新的 shell 中只使用已安装的版本：

## 五、安装 MongoDB

既然我们安装了 docker 　我们就用 docker 安装 MongoDB

### 1. 拉取镜像

```bash
 docker pull mongo # 直接拉去默认tag 为latest 的mongo:latest 镜像
```

### 2. 使用 mongo 镜像

```bash
docker run --name mongo -p 27017:27017 -v /mongo/db:/data/db -d mongo
```

命令说明：

- --name 命名容器名字
- -p 27017:27017 :将容器的 27017 端口映射到主机的 27017 端口
- -v /mongo/db:/data/db :将主机中/mongo/db 挂载到容器的/data/db，作为 mongo 数据存储目录

### 3. 查看容器启动情况

```bash
docker ps
```

可看到 已经运行成功了

使用 mongo 镜像执行 mongo 命令连接到刚启动的容器

```bash
docker run -it mongo:latest mongo
```

## 六、安装 MongoDB

跟安装 MongoDB 一样

```bash
docker pull mysql:5.6
mkdir -p /mysql/data /mysql/logs /mysql/conf
docker run -p 3306:3306 --name mymysql \
           -v /mysql/conf:/etc/mysql/conf.d \
           -v /mysql/logs:/logs \
           -v /mysql/data:/var/lib/mysql \
           -e MYSQL_ROOT_PASSWORD=123456 \
           -d mysql:5.6
```

命令说明：

- -p 3306:3306 #将容器的 3306 端口映射到主机的 3306 端口。
- -v /mysql/conf:/etc/mysql/conf.d #将主机当前目录下的 conf/my.cnf 挂载到容器的 /etc/mysql/my.cnf。
- -v /mysql/logs:/logs #将主机当前目录下的 logs 目录挂载到容器的 /logs。
- -v /mysql/data:/var/lib/mysql #将主机当前目录下的 data 目录挂载到容器的 /var/lib/mysql 。
- -e MYSQL_ROOT_PASSWORD=123456 #初始化 root 用户的密码。

查看容器启动情况

```bash
docker ps
```

** 注意 ： mysql 5.7 及以上版本 映射的配置文件目录可能有所不同 详细可取 [Docker Hub](https://hub.docker.com/_/mysql) 查看**

## 使用 docker-compose

这个以后另开文章详细讲
