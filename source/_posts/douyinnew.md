---
title: 抖音去水印详细原理步骤
categories: 全栈
abbrlink: 458fb5c9
date: 2019-04-25 23:21:34
thumbnail: https://ae01.alicdn.com/kf/HTB1_eaSXHus3KVjSZKbq6xqkFXar.jpg
---

## 2019-05-30 更新

> 最近抖音修复了下面的方法，所以下面方法已失效!  

**接口也因此做了调整可正常访问**

因为分享得到的 id 已经不是`video_id` 还是变成了`s_vid` 所以下面方法已失效

## 接口

> 特地写了去水印的 API 接口

```
https://api.chenyeah.com/douyin?url=
```

**url 参数是抖音分享链接**

## 起因

今天有个朋友发邮件问我抖音去水印的技术怎么弄的，其实并不是我们主动去了水印而是我们找到了去水印视频的真实地址，下面我真实演示一个视频去水印的过程，代码就不撸了

## 一、得到抖音分享地址

这一步很简单我就不多说了 这里我直接拿了最近泪目的钢铁侠的视频
http://v.douyin.com/616Smb/

我们用浏览器直接打开这个链接会重定向到一个正式页面

![WX20190425-230612@2x.png](https://cdn.nlark.com/yuque/0/2019/png/172796/1559007554835-assets/web-upload/b4f6f26d-41d7-462d-9603-ffc153822cdc.png)

```
https://www.iesdouyin.com/share/video/6628848121952603405/?region=CN&mid=6628848126449060616&u_code=m1d5960d&titleType=title&timestamp=1556203935&utm_campaign=client_share&app=aweme&utm_medium=ios&tt_from=copy&utm_source=copy&iid=69794020868
```

点击页面上的播放按钮，视频自动加载播放。但是这个播放的视频是带有水印。

## 二、获取视频的地址

播放按钮浏览器检查可以看见视频的地址

![WX20190425-231339@2x.png](https://cdn.nlark.com/yuque/0/2019/png/172796/1559007555074-assets/web-upload/f56cf8d6-c810-4f04-bed8-4a6e6f14d0b9.png)

```
https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200f3d0000bfv6ccn3cp5e8vksdb5g&line=0
```

### 视频的真实地址

同时还会重定向视频的真实地址,真时地址这才是我们想要的，但是直接打开这个真实地址是有水印的，对我们无用

```
http://v3-dy.ixigua.com/3e795a46d915afac45e114d491e6d64e/5cc1daed/video/m/2208354dfed0e1c462e890d87774419219611610a208000010e48e940cea/?rc=amV2eWhzNmY5aTMzZ2kzM0ApQHRoaGR1KUc2Ozk7MzQzMzgzNTUzNDVvQGgzdSlAZjN1KXB6YnMxaDFwekApNTRkMmFoNTJga2BzXy0tMC0vc3MtbyNqdDppLzEvMC4wMS0uLTIwMjE2LTojbyM6YS1xIzpgYmJeZl5fdGJiXmA1Ljo%3D
```

## 三、获取视频的无水印地址

**其实，只要把视频链接里的 playwm 替换成 play 就行了。**

```
https://aweme.snssdk.com/aweme/v1/play/?video_id=v0200f3d0000bfv6ccn3cp5e8vksdb5g&line=0
```

我们打开这个这个地址会发现 视频不存在

![WX20190425-230243@2x.png](https://cdn.nlark.com/yuque/0/2019/png/172796/1559007554863-assets/web-upload/ee1a76b6-766b-4762-ac8d-f9c9d74081c3.png)

**不要慌，这被坑了。主要原因是抖音服务器会判断一下 浏览器的`user-agent`，不是手机可能不给放，用 `chrome` 模拟 手机打开就行了。**

> 上文同样方法就能看到重定向后的真实视频地址

```
http://v3-dy-x.ixigua.com/ee9da215d515dbd3e504bf2e0db2ea16/5cc1ddbc/video/m/220664abf96662b468583c854a44d7ccff011610a1bc00001613e5649251/?rc=amV2eWhzNmY5aTMzZ2kzM0ApQHRAbzs0NDgzNTszNDs6Njg3PDNAKXUpQGczdylAZmxkamV6aGhkZjs0QDJhaDUyYGtgc18tLTAtL3NzLW8jbyMuLTY2NS0uLS0xLi8vLS4vaTpiLW8jOmAtbyNtbCtiK2p0OiMvLl4%3D
```

**这才是我们最终目标无水印的真实视频地址**

**注意：这个地址时效性很短，想再次获取就必须按照上一步操作获取新的真实地址**

## 警告

<strong style="color:red">此文章及接口仅作学习交流之用，请勿用作商业行为！其他违法行为与本人无关！</strong>
