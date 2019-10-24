---
title: 在 Linux 下搭建 Git 服务器步骤
categories: 服务端
tag:
  - linux
  - git
abbrlink: d2d14fcf
date: 2018-04-16 00:00:00
---

由于代码经常改动，搞得头大，就想找个代码管理工具。查了一些资料，最后选择使用 git 管理代码，下面将搭建的过程记录下来。（亲测可以使用） "
content: "### 环境：
服务器 CentOS6.6 + git（version 1.7.1）
客户端 Windows10 + git（version 2.8.4.windows.1）

### ① 安装 Git

Linux 做为服务器端系统，Windows 作为客户端系统，分别安装 Git
服务器端：

```bash
yum install -y git
```

安装完后，查看 Git 版本

```bash
[root@localhost ~]# git --version git version 1.12.6
```

客户端：
下载 Git for Windows，地址：https://git-for-windows.github.io/
安装完之后，可以使用 Git Bash 作为命令行客户端。
安装完之后，查看 Git 版本

```bash
 $ git --version git version 2.15.1.windows.2
```

### ② 服务器端创建 git 用户，用来管理 Git 服务，并为 git 用户设置密码

```bash
 [root@localhost home]# useradd git [root@localhost home]# passwd git
```

### ③ 服务器端创建 Git 仓库

设置 /home/first.git 为 Git 仓库
然后把 Git 仓库的 owner 修改为 git

```bash
[root@localhost home]# git init --bare first.git
Initialized empty Git repository in /home/first.git
[root@localhost git]# chown -R git:git first.git
```

给仓库设置 700 权限 尽量 700 权限

```bash
 chmod -R 700 /home/first.git/*
```

### ④ 客户端 clone 远程仓库

Git 服务器就已经搭得差不多了。下面我们在客户端 clone 一下远程仓库

```bash
 $ git clone git@xxx.xxx.xxx.xxx:/home/first.git Cloning into 'first'...
 The authenticity of host 'xxx.xxx.xxx.xxx (xxx.xxx.xxx.xxx)' can't be established. RSA key fingerprint is 2b:55:45:e7:4c:29:cc:05:33:78:03:bd:a8:cd:08:9d. Are you sure you want to continue connecting (yes/no)? yes Warning: Permanently added 'xxx.xxx.xxx.xxx' (RSA) to the list of known hosts. git@192.168.8.34's password:
```

这里两点需要注意：第一，当你第一次使用 Git 的 clone 或者 push 命令连接 GitHub 时，会得到一个警告：
这是因为 Git 使用 SSH 连接，而 SSH 连接在第一次验证 GitHub 服务器的 Key 时，需要你确认 GitHub 的 Key 的指纹信息是否真的来自 GitHub 的服务器，输入 yes 回车即可。
Git 会输出一个警告，告诉你已经把 GitHub 的 Key 添加到本机的一个信任列表里了：

```bash
 Warning: Permanently added 'github.com' (RSA) to the list of known hosts.
```

此时 `C:\\Users\\用户名\\.ssh` 下会多出一个文件 known_hosts，以后在这台电脑上再次连接目标 Git 服务器时不会再提示上面的语句。这个警告只会出现一次，后面的操作就不会有任何警告了。如果你实在担心有人冒充 GitHub 服务器，输入 yes 前可以对照 GitHub 的 RSA Key 的指纹信息是否与 SSH 连接给出的一致。第二，这里提示你输入密码才能 clone，当然如果你知道密码，可以键入密码来进行 clone，但是更为常见的方式，是利用 SSH 的公钥来完成验证。

### ⑤ 客户端创建 SSH 公钥和私钥

```bash
 $ ssh-keygen -t rsa -C "youremail@example.com"
```

你需要把邮件地址换成你自己的邮件地址，然后一路回车，使用默认值即可，由于这个 Key 也不是用于军事目的，所以也无需设置密码。
如果一切顺利的话，可以在用户主目录里找到.ssh 目录，里面有 id_rsa 和 id_rsa.pub 两个文件，这两个就是 SSH Key 的秘钥对，id_rsa 是私钥，不能泄露出去，id_rsa.pub 是公钥，可以放心地告诉任何人。

### ⑥ 服务器端 Git 打开 RSA 认证

然后就可以去 Git 服务器上添加你的公钥用来验证你的信息了。在 Git 服务器上首先需要将/etc/ssh/sshd_config 中将 RSA 认证打开，即：

```bash
 RSAAuthentication yes PubkeyAuthentication yes AuthorizedKeysFile .ssh/authorized_keys
```

这里我们可以看到公钥存放在.ssh/authorized_keys 文件中。所以我们在/home/git 下创建.ssh 目录然后把 .ssh 文件夹的 owner 修改为 git

```bash
 [root@localhost git]# chown -R git:git .ssh
```

### ⑦ 将公钥导入服务器端 authorized_keys 文件

将电脑`C:\\Users\\用户名\\.ssh\\id_rsa.pub`文本可以导入到`/home/git/.ssh/authorized_keys`

#### 重要：

修改 .ssh 目录的权限为 700
修改 .ssh/authorized_keys 文件的权限为 600

```bash
 [root@localhost git]# chmod 700 .ssh
 [root@localhost git]# cd .ssh
 [root@localhost .ssh]# chmod 600 authorized_keys
```

再重启 ssh 服务

```bash
 service sshd start
```

之后 clone 就不要输密码了

### ⑨ 禁止 git 用户 ssh 登录服务器

之前在服务器端创建的 git 用户不允许 ssh 登录服务器编辑 /etc/passwd
找到：
`git:x:502:504::/home/git:/bin/bash` 修改为
`git:x:502:504::/home/git:/bin/git-shell`
此时 git 用户可以正常通过 ssh 使用 git，但无法通过 ssh 登录系统。
