---
title: 服务器打造专属分享型网盘
categories: 服务端
abbrlink: 6c1c0af
date: 2019-03-15 10:46:23
cover: https://cdn.nlark.com/yuque/0/2019/jpeg/172796/1559115407648-assets/web-upload/75719cd4-0de0-43a6-82e3-05ba70ee9dd9.jpeg
---

> 阿里云的一台服务器一直吃灰，今天打算打造基于 onindex 专属分享型网盘。OneIndex 针对 Onedrive 网盘的一个开源程序,可以将 Onedrive 存储的文件展示，直连下载。视频还能在线播放！不用服务器空间，不走服务器流量！非常推荐大家试一试，搭建自己的网盘！
> ![阿里云](https://cdn.nlark.com/yuque/0/2019/jpeg/172796/1560819295547-assets/web-upload/e472b4dc-912d-4b35-ac65-e93e834450ce.jpeg)
> 接下来说一下 `Ubuntu Docker Onedrive` 安装方式

## 安装 Docker CE

参考这里 [docker 安装](https://yoaio.com/posts/aa43c23f/#%E4%BA%8C-%E5%AE%89%E8%A3%85-docker-%E5%8F%8A-docker-compose)

## Docker-oneindex 安装

> docker 已经安装成功 接下来就方便多了
> 根据[Docker-oneindex 版本库](https://github.com/TimeBye/oneindex)方便多了

- 使用 docker run 命令运行：

  - ````bash
    docker run -d --name oneindex \
        -p 80:80 --restart=always \
        -v ~/oneindex/config:/var/www/html/config \
        -v ~/oneindex/cache:/var/www/html/cache \
        -e REFRESH_TOKEN='0 * * * *' \
        -e REFRESH_CACHE='*/10 * * * *' \
        setzero/oneindex
    ```

    ````

  - 停止删除容器：

  ```bash
  docker stop oneindex
  docker rm -v oneindex
  ```

- 使用 docker-compose 运行：
  - ```bash
    docker-compose up -d
    ```
  - 停止删除容器：
  ```bash
  docker-compose down
  ```
  **默认 80 端口 ,可以直接输入服务器 IP 或者 域名解析**

### 变量：

- TZ：时区，默认 Asia/Shanghai
- PORT：服务监听端口，默认为 80
- DISABLE\*CRON：是否禁用 crontab 自动刷新缓存，设置任意值则不启用
- REFRESH_TOKEN：使用 crontab 进行 token 更新，默认 0 \* \* \* \*，即每小时更新一次
- REFRESH*CACHE：使用 crontab 进行缓存更新，默认*/10 \* \* \* \*，即每 10 分钟更新一次
- SSH_PASSWORD：sshd 用户密码，用户名为 root，若不设置则不启用 sshd

### 持久化：

- /var/www/html/cache：缓存存储目录
- /var/www/html/config：配置文件存储目录

## onindex 配置

![onindex 配置](https://cdn.nlark.com/yuque/0/2019/gif/172796/1560819297633-assets/web-upload/8909f40e-a386-4188-9dfa-bbeb9d439fae.gif)

**oneindex 设置地址为 `url/?/admin`**

## 问题

可能会遇到首页打不开的情况 可以 把 docker 镜像停止重启一次就可以

我的 网盘地址 https://pan.chenyeah.com/
