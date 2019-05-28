---
title: 在linux上安装Gogs 的实践
categories: 服务端
tag:
  - linux
  - git
  - gogs
abbrlink: 9aa0c4bc
date: 2018-08-14 00:00:00
---

> 为了同步代码我们一般都需要使用到版本控制系统，目前流行的就是 Git 和 SVN 这两种。这次我打算搭建是的 Git 这个版本控制系统。Gogs 一款极易搭建的自助 Git 服务，比起 gitlab 更清爽简洁，所以就选它他了"

## 前言

目前比较好的 Git 服务有两个，Gitlab 和 Gogs，Gitlab 作为 Github 的山寨版，功能非常全面，但是也十分臃肿对服务器的要求也比较高。国人开发的 Gogs 则十分轻量，据说一个树莓派都可以在上面运行起来。作为个人用的代码托管平台，Gogs 比较适合我。  
 Gogs 的官网地址是：[Gogs](https://gogs.io/)

## 安装前的准备

- 安装 Git  
  如果你想在 Linux 上用二进制安装程序来安装 Git，可以使用发行版包含的基础软件包管理工具来安装。

  - 你可以使用 yum：

    ```
    $ sudo yum install git
    ```

  - 如果你在基于 Debian 的发行版上，请尝试用 apt-get：

    ```
    $ sudo apt-get install git
    ```

- 创建 git 账号,Gogs 推荐使用 Git 用户运行

  root 账户登陆服务器 使用命令`useradd git`添加用户`git` 并用 `passwd git` 来设置`git`用户的密码。

- 下载软件安装包

  https://gogs.io/docs/installation/install_from_binary 来下载与其对应的二进制安装包

- 尽量 申请域名做反向代理

  比如`git.example.com` 也尽量申请个 ssl 证书保证安全

## 安装步骤

#### 将安装包解压至 git 用户目录下（/home/git）并修改其权限和所有者

```shell
   cd /home/git
   wget https://dl.gogs.io/0.11.86/gogs_0.11.86_linux_amd64.tar.gz
   tar -xf gogs_0.11.86_linux_amd64.tar.gz
   chmod -R 700 /home/git/gogs   //修改其权限
   chown -R git:git /home/git/gogs  //修改其所有者
```

#### 使用 git 用户运行 gogs

```
su - git -c "cd /home/git/gogs && ./gogs web"
```

会自动使用端口 3000 ，如果 3000 端口被占用可使用以下命令来换成其他端口

```
su - git -c "cd /home/git/gogs && ./gogs web -port 3001"
```

#### 访问

**使用浏览器访问[https://git.example.com/install](https://git.example.com/install) 或者 `ip:port/install`，完成配置安装**

这里按需求自行配置

## 最后

大功告成，体验感觉跟 github 没有太大的区别 就可以拥有自己的 Git 服务了！
