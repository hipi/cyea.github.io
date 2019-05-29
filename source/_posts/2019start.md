---
title: 2019前端的展望与目标
categories: 全栈
tag:
  - js
  - redux
  - react
  - webpack
  - hapi
  - typescript
  - graphql
abbrlink: 8058f2c3
date: 2019-02-13 10:41:34
thumbnail: https://cdn.nlark.com/yuque/0/2019/jpeg/172796/1559115407275-assets/web-upload/3f597dca-45f6-43f9-801e-5da86cb23223.jpeg
---

> 前端发展依旧迅速 各种技术，我快学不动啦😂😂😂😂😂

## React Hooks

react 都核心思想就是，将一个页面拆成一堆独立的，可复用的组件，并且用自上而下的单向数据流的形式将这些组件串联起来。但假如你在大型的工作项目中用 react，你会发现你的项目中实际上很多 react 组件冗长且难以复用。尤其是那些写成 class 的组件，它们本身包含了状态（state），所以复用这类组件就变得很麻烦。

React Hooks 要解决的问题是状态共享，是继 render-props 和 higher-order components 之后的第三种状态共享方案，不会产生 JSX 嵌套地狱问题。
React Hooks 带来的好处不仅是 “更 FP，更新粒度更细，代码更清晰”，还有如下三个特性：

- 多个状态不会产生嵌套，写法还是平铺的（renderProps 可以通过 compose 解决，可不但使用略为繁琐，而且因为强制封装一个新对象而增加了实体数量）。
- Hooks 可以引用其他 Hooks。
- 更容易将组件的 UI 与状态分离。

文章：[一篇看懂 React Hooks](https://chenyeah.com/posts/61d76a16/)

## 基于 Redux 的状态管理

从 2013 年 React 发布至今已近 6 个年头，前端框架逐渐形成 React/Vue/Angular 三足鼎立之势。几年前还在争论单向绑定和双向绑定孰优孰劣，现在三大框架已经不约而同选择单向绑定，双向绑定沦为单纯的语法糖。框架间的差异越来越小，加上 Ant-Design/Fusion-Design/NG-ZORRO/ElementUI 组件库的成熟，选择任一你熟悉的框架都能高效完成业务。
那接下来核心问题是什么？我们认为是 状态管理。简单应用使用组件内 State 方便快捷，但随着应用复杂度上升，会发现数据散落在不同的组件，组件通信会变得异常复杂。我们先后尝试过原生 Redux、分形 Fractal 的思路、自研类 Mobx 框架、Angular Service，最终认为 Redux 依旧是复杂应用数据流处理最佳选项之一。
庆幸的是除了 React 社区，Vue 社区有类似的 Vuex，Angular 社区有 NgRx 也提供了几乎同样的能力，甚至 NgRx 还可以无缝使用 redux-devtools 来调试状态变化。
![image](https://wx4.sinaimg.cn/large/0079V2lRgy1g04ltzlsy3j314u0co76z.jpg)

| 原则                                 | 方法                             | 引发的问题                    |
| :----------------------------------- | :------------------------------- | :---------------------------- |
| Single source of truth               | 组件 Stateless，数据来源于 Store | 如何组织 Store                |
| State is read-only                   | 只能通过触发 action 来改变 State | action 数量膨胀，大量样板代码 |
| Changes are made with pure functions | Reducer 是纯函数                 | 副作用如何处理，大量样板代码  |

### 如何组织 Action？

- action type 需要全局惟一，因此我们给 action type 添加了 prefix，其实就是 namespace 的概念
- 为了追求体验，请求（Fetch）场景需要处理 3 种状态，对应 LOADING/SUCCESS/ERROR 这 3 个 action，我们通过 FetchTypes 类型来自动生成对应到 3 个 action

### 如何组织 Store/Reducer？

- reducer 和 view 不必一一对应，应用中同时存在组件树和状态树，按照各自需要去组织，通过 connect 来绑定状态树的一个或多个分支到组件树
- 通过构造一些预设数据类型来减少样板代码。对于 Fetch 返回的数据我们定义了 AsyncTuple 这种类型，减少了样板代码
- 明确的组织结构，第 1 层是 ROOT，第 2 层是各个页面，第 3 层是页面内的卡片，第 4 层是卡片的数据，这样划分最深处基本不会超过 5 层

## hapi.js

Hapi（简称 HAPP API，发音为“happy”） 是一个容易使用的以配置为中心的框架，内置支持输入验证，缓存，身份验证以及用于构建 Web 和服务应用程序的其他基本工具。hapi 使开发人员能够专注于以高度模块化和规范性的方式编写可重用的应用程序逻辑。Hapi 是一个抽象了现有 Node API 的新框架。Express 更老，更成熟。Express 代码看起来更像本地 Node。  
hapi.js 还有个优点可以用过插件 hapi-swagger,自动生成 swagger 文档免除了 api 与文档不同步的困扰

## GraphQL

GraphQL 已被 GitHub 等技术引领者采用。 然而，它并没有像一些预测的那样快速地飞涨。 据 JS 状态调查 显示，只有 1/5 的前端开发人员使用过 GraphQL ，但是有 62.5％ 的开发人员已经听说过它并希望使用它，相当惊人。

## TypeScript

TypeScript 可能是 JavaScript 的未来（但对于 Flow 来说就不一定了）。

事实上，在 Stack Overflow 调查中，TypeScript 的评分高于 JavaScript 本身，为 67％ ，而最受喜爱的语言为 61.9％ 。 根据 JS 的状态调查，超过 80％ 的开发人员希望使用 TS 或已经使用它并享受它。 对于 Flow，只有 34％ 的开发人员正在使用它或想要使用它。

根据所有迹象，TypeScript 是 JS 中静态类型的首选解决方案，许多人选择使用普通的 JavaScript 。 在 2018 年，TS 的 npm 下载数量大幅增长，而 Flow 保持不变。 TypeScript 看起来正在从狂热追随者转向广泛采用。

Jest 也正在从 Flow 切换到 TS，Vue 3.0 也开始用 TS 重写。如果你还没有使用，可以考虑切换，绝对能给项目带来很大提升。
TS 最大的优势是它提供了强大的静态分析能力，结合 TSLint 能对代码做到更加严格的检查约束。传统的 EcmaScript 由于没有静态类型，即使有了 ESLint 也只能做到很基本的检查，一些 type 问题可能线上出了 Bug 后才被发现。

学习网址：[TypeScript 中文网](https://www.tslang.cn/docs/handbook/basic-types.html)

## Webpack

Webpack 3 发布仅 8 个月后，版本 4 发布了。 Webpack 4 继续推动简化和更快的构建，声称高达 98％ 的改进。 它选择合理的默认值，在没有插件的情况下处理更多功能，并且不再需要使用配置文件。 Webpack 现在还支持 WebAssembly，并允许您直接导入 WebAssembly 文件。而且 Webpack@5.0.0-alpha.10 也已发布。

推荐阅读：[Webpack 4 教程：从零配置到生产发布（2018）](https://www.html.cn/archives/9436)

## 展望 2019 年

- TypeScript 开始成为标准 JavaScript 的默认选择。
- 随着基础的建立和不断推动的 Web 体验改进，WebAssembly 将开始看到更多的生命力。
- React 保持领先，但 Vue 和 Angular 用户会继续增长。
- CSS-in-js 可能会成为默认的样式化方法，而不是普通的 CSS。
- 毫不奇怪，性能仍然是关注的焦点，诸如 PWAs 和代码分割之类的事情成为每个应用程序的标准。
- 在采用 PWA 的基础上，web 变得更加本地化，具有离线功能和无缝的桌面/移动体验。
- 我们继续看到 CLI 工具和框架的增长，以继续抽象出构建应用程序的繁琐方面，允许开发人员专注于生成功能。
- 更多的公司采用具有统一代码库的移动解决方案，如 React Native 或 Flutter 。
- Containerization 的影响（即 Docker, Kubernetes)在前端过程中变得更为普遍。
- GraphQL 在采用方面会有大的飞跃，并在更多公司中得到应用。
- 虚拟现实使用 A-Frame，React VR 和 Google VR 等库向前迈进。

### 具体计划：

- 学习 Typescript GraphQL
- 深入 Node.js
- 坚持更新博客，更新基础知识、技术总结和项目开发中遇到的问题
- 更加深入的去理解 Vue 和 Node，同时实际尝试自己写一下服务端渲染
- 至少写一个 React Reduce 相关的项目
- 看看 deno 这种未来可能替代 Node 的新东西
