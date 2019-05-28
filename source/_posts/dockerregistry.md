---
title: DockerHub国内镜像设置加速服务
categories: 全栈
tag:
  - docker
abbrlink: ce680882
date: 2019-03-29 16:15:03
---

## 哪些 docker hub 镜像加速

目前有许多镜像地址

1. [https://docker.mirrors.ustc.edu.cn/](https://docker.mirrors.ustc.edu.cn/) （中国科学技术大学（LUG@USTC）的开源镜像）
2. [https://registry.docker-cn.com](https://registry.docker-cn.com) （docker 官方中国镜像）

阿里云的容器镜像服务里也有专属加速器地址 可进 [https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors) 查看，大致是 https://xxxxxxxx.mirror.aliyuncs.com

我用的当中 属 **中国科学技术大学（LUG@USTC）的开源镜像**最快

## 配置镜像加速

Linux 新版的 Docker 使用镜像配置地址是 `/etc/docker/daemon.json` 但可能文件不存在

```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://docker.mirrors.ustc.edu.cn","https://registry.docker-cn.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

这时再下 就快多了
