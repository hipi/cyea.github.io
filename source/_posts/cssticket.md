---
title: CSS小技巧小汇
categories: 前端
tags: css
abbrlink: 65e9dcbb
date: 2019-01-16 01:21:58
cover: https://cdn.nlark.com/yuque/0/2019/jpeg/172796/1559115407371-assets/web-upload/458eb26c-01b2-4ee4-9dcc-534fb2ef8072.jpeg
---

## 一、flex 项中子元素文本截断 text-overflow:ellipsis 失效,给你一个完美的解决方案。

flexbox 布局时 flex 项子元素中的文本溢出后想显示省略号(…)，结果设置 text-overflow:ellipsis 后没效果，我们来看代码：
HTML 代码：

```html
<div class="flex">
  <div class="col1">图标</div>
  <div class="col2">
    <div class="item-con">
      flexbox
      布局旨在提供一个更有效地布局、对齐方式，并且能够使容器中的子元素大小未知或动态变化情况下仍然能够分配好子元素之间的空间。
    </div>
  </div>
</div>
```

CSS 代码：

```css
.flex {
  display: flex;
}
.flex .col1 {
  margin-right: 6px;
}
.flex .col2 {
  flex: 1;
}
.flex .col2 .item-con {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
```

完整的 DEMO ：

<iframe id="cp_embed_pQMqjN" src="//codepen.io/feiwen8772/embed/pQMqjN?height=427&amp;theme-id=0&amp;slug-hash=pQMqjN&amp;default-tab=html%2Cresult&amp;animations=run&amp;editable=&amp;embed-version=2&amp;user=feiwen8772" scrolling="no" frameborder="0" height="427" allowtransparency="true" allowfullscreen="true" allowpaymentrequest="true" name="CodePen Embed" title="CodePen Embed 3" class="cp_embed_iframe " style="width: 100%; overflow: hidden; display: block"></iframe>

我们看到 `.col2` 设置 `flex: 1;` , `.item-con` 设置了 `text-overflow:ellipsis` ，但是文本还是溢出了。

这种布局在移动端页面开发时候经常遇到，我们不能为 `.item-con` 元素设置个宽度，这样就无法适应不同屏幕尺寸的终端设备。

解决方案：在 `flex`项中设置 `min-width: 0;`
解决方案是在 `flex` 项（上例子中 `.col2` 元素）中设置 `min-width: 0;`，当然你也可以设置其他合适的 `min-width`值。

<iframe id="cp_embed_aQeXzx" src="//codepen.io/feiwen8772/embed/aQeXzx?height=265&amp;theme-id=0&amp;slug-hash=aQeXzx&amp;default-tab=css%2Cresult&amp;animations=run&amp;editable=&amp;embed-version=2&amp;user=feiwen8772" scrolling="no" frameborder="0" height="265" allowtransparency="true" allowfullscreen="true" allowpaymentrequest="true" name="CodePen Embed" title="CodePen Embed 2" class="cp_embed_iframe " style="width: 100%; overflow: hidden; display: block"></iframe>
<hr>
## 二、css 文本多行显示，超出省略号表示  
```css
.text {
    width: 200px;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
    -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
    -webkit-line-clamp: 3; /** 显示的行数 **/
    overflow: hidden;  /** 隐藏超出的内容 **/
 }
```

## 三、进度条动画

```html
<style>
  .process {
    width: 200px;
    height: 20px;
    border-radius: 10px;
    background: repeating-linear-gradient(
      -45deg,
      #fafafa 25%,
      #f93e3e 0,
      #f93e3e 50%,
      #fafafa 0,
      #fafafa 75%,
      #f93e3e 0
    );
    background-size: 15px 15px;
    animation: panoramic 8s linear infinite;
  }
  @keyframes panoramic {
    to {
      background-position: 200%;
    }
  }
</style>
<div class="process"><div></div></div>
```

<div class="process"><div>

<style>
.process{
    width:200px;
    height:20px;
    border-radius:10px;
    background: repeating-linear-gradient(-45deg, #fafafa 25%, #f93e3e 0, #f93e3e 50%, #fafafa 0, #FAFAFA 75%, #f93e3e 0);
    background-size: 15px 15px;
    animation: panoramic 8s linear infinite;
}
@keyframes panoramic {
    to {
        background-position: 200%;
   }
}
</style>
