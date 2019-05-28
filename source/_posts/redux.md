---
title: Redux流程讲解
categories: 前端
tag:
  - js
  - redux
abbrlink: f4eb40ab
date: 2018-06-20 15:06:41
---

> 随着应用程序单页面需求的越来越复杂，应用状态的管理也变得越来越混乱，而 Redux 的就是为解决这一问题而出现的。在一个大型的应用程序中，应用的状态不仅包括从服务器获取的数据，还包括本地创建的数据，以及反应本地 UI 状态的数据，而 Redux 正是为解决这一复杂问题而存在的。

redux 作为一种单向数据流的实现，配合 react 非常好用，尤其是在项目比较大，逻辑比较复杂的时候，单项数据流的思想能使数据的流向、变化都能得到清晰的控制，并且能很好的划分业务逻辑和视图逻辑。下图是 redux 的基本运作的流程。

![](https://user-gold-cdn.xitu.io/2018/7/31/164edab5e41258c1?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

如上图所示，该图展示了 Redux 框架数据的基本工作流程。简单来说，首先由 view dispatch 拦截 action，然后执行对应 reducer 并更新到 store 中，最终 views 会根据 store 数据的改变执行界面的刷新渲染操作。

同时，作为一款应用状态管理框架，为了让应用的状态管理不再错综复杂，使用 Redux 时应遵循三大基本原则，否则应用程序很容易出现难以察觉的问题。这三大原则包括： • **单一数据源** 整个应用的 State 被存储在一个状态树中，且只存在于唯一的 Store 中。 • **State 是只读的** 对于 Redux 来说，任何时候都不能直接修改 state，唯一改变 state 的方法就是通过触发 action 来间接的修改。而这一看似繁琐的状态修改方式实际上反映了 Rudux 状态管理流程的核心思想，并因此保证了大型应用中状态的有效管理。 • **应用状态的改变通过纯函数来完成** Redux 使用纯函数方式来执行状态的修改，Action 表明了修改状态值的意图，而真正执行状态修改的则是 Reducer。且 Reducer 必须是一个纯函数，当 Reducer 接收到 Action 时，Action 并不能直接修改 State 的值，而是通过创建一个新的状态对象来返回修改的状态。

# redux 的三大元素

和 Flux 框架不同，Redux 框架主要由 Action、Reducer 和 Store 三大元素组成。

## Action

Action 是一个普通的 JavaScript 对象，其中的 type 属性是必须的，用来表示 Action 的名称，type 一般被定义为普通的字符串常量。为了方便管理，一般通过 action creator 来创建 action，action creator 是一个返回 action 的函数。

在 Redux 中，State 的变化会导致 View 的变化，而 State 状态的改变是通过接触 View 来触发具体的 Action 动作的，根据 View 触发产生的 Action 动作的不同，就会产生不同的 State 结果。可以定义一个函数来生成不同的 Action，这个函数就被称为 action creator。例如：

```
    const ADD_TODO = '添加事件 TODO';

    function addTodo(text) {
        return {
          type: ADD_TODO,
        text
      }
    }

    const action = addTodo('Learn Redux');
```

上面代码中，addTodo 就是一个 action creator。但当应用程序的规模越来越大时，建议使用单独的模块或文件来存放 action。

## Reducer

当 Store 收到 action 以后，必须返回一个新的 State 才能触发 View 的变化，State 计算的过程即被称为 Reducer。Reducer 本质上是一个函数，它接受 Action 和当前 State 作为参数，并返回一个新的 State。格式如下：

```
    const reducer = function (state, action) {
        // ...
      return new_state;
    };

```

为了保持 reducer 函数的纯净，请不要在 reducer 中执行如下的一些操作： • 修改传入参数； • 执行有副作用的操作，如 API 请求和路由跳转； • 调用非纯函数，如 Date.now() 或 Math.random()

对于 Reducer 来说，整个应用的初始状态就可以直接作为 State 的默认值。例如：

```
    const defaultState = 0;
    const reducer = (state = defaultState, action) => {
        switch (action.type) {
          case 'ADD':
          return state + action.payload;
        default:
          return state;
      }
    };
    //手动调用
    const state = reducer(1, {
        type: 'ADD',
      payload: 2
    });

```

不过，在实际使用过程中，reducer 函数并不需要像上面那样进行手动调用，Store 的 store.dispatch 方法会触发 Reducer 的自动执行。为此，只需要在生成 Store 的时候将 Reducer 传入 createStore 方法即可。例如：

```
    import { createStore } from 'redux';
    const store = createStore(reducer);

```

在上面的代码中，createStore 函数接受 Reducer 作为参数，该函数返回一个新的 Store，以后每当 store.dispatch 发送过来一个新的 Action，就会自动调用 Reducer 得到新的 State。

## Store

Store 就是数据保存的地方，可以把它看成一个容器，整个应用中只能有一个 Store。同时，Store 还具有将 Action 和 Reducers 联系在一起的作用。Store 具有以下的一些功能： • 维持应用的 state； • 提供 getState()方法获取 state； • 提供 dispatch(action)方法更新 state； • 通过 subscribe(listener)注册监听器; • 通过 subscribe(listener)返回的函数注销监听器。

根据已有的 Reducer 来创建 Store 是一件非常容易的事情，例如 Redux 提供的 createStore 函数可以很方便的创建一个新的 Store。

```
    import { createStore } from 'redux'
    import todoApp from './reducers'
    // 使用createStore函数创建Store
    let store = createStore(todoApp)

```

其中，createStore 函数的第二个参数是可选的，该参数用于设置 state 的初始状态。而这对于开发同构应用时非常有用的，可以让服务器端 redux 应用的 state 与客户端的 state 保持一致，并用于本地数据初始化。

    let store = createStore(todoApp, window.STATE_FROM_SERVER)

Store 对象包含所有数据，如果想得到某个时刻的数据，则需要利用 state 来获取。例如：

```
    import { createStore } from 'redux';
    const store = createStore(fn);
    //利用store.getState()获取state
    const state = store.getState();

```

Redux 规定，一个 state 只能对应一个 view，只要 state 相同得到的 view 就相同，这也是 Redux 框架的重要特性之一。

到此，关于 Redux 的运作流程就非常的清晰了，下面总结下 Redux 的运作流程。

1.  当用户触摸界面时，调用 store.dispatch(action)捕捉具体的 action 动作。
2.  然后 Redux 的 store 自动调用 reducer 函数，store 传递两个参数给 reducer 函数：当前 state 和收到的 action。其中，reducer 函数必须是一个纯函数，该函数会返回一个新的 state。
3.  根 reducer 会把多个子 reducer 的返回结果合并成最终的应用状态，在这一过程中，可以使用 Redux 提供的 combineReducers 方法。使用 combineReducers 方法时，action 会传递给每个子的 reducer 进行处理，在子 reducer 处理后会将结果返回给根 reducer 合并成最终的应用状态。
4.  store 调用 store.subscribe(listener)监听 state 的变化，state 一旦发生改变就会触发 store 的更新，最终 view 会根据 store 数据的更新刷新界面。

# Redux 实现

## 1，创建 store

store 就是 redux 的一个数据中心，简单的理解就是我们所有的数据都会存放在里面，然后在界面上使用时，从中取出对应的数据。因此首先我们要创建一个这样的 store，可以通过 redux 提供的 createStore 方法来创建。

```js
    export default function createStore(reducer, preloadedState, enhancer) {
        ...
      return {
          dispatch,
        subscribe,
        getState,
        replaceReducer,
        [$$observable]: observable
      }
    }
```

可以看到 createStore 有三个参数，返回一个对象，里面有我们常用的方法，下面一一来看一下。

### getState

getState 用于获取当前的状态，格式如下：

```
    function getState() {
          return currentState
      }
```

Redux 内部通过 currentState 变量保存当前 store，变量初始值即我们调用时传进来的 preloadedState，getState()就是返回这个变量。

### subscribe

代码本身也不难，就是通过 nextListeners 数组保存所有的回调函数，外部调用 subscribe 时，会将传入的 listener 插入到 nextListeners 数组中，并返回 unsubscribe 函数，通过此函数可以删除 nextListeners 中对应的回调。以下是该函数的具体实现：

```js
var currentListeners = [];
var nextListeners = currentListeners;

function ensureCanMutateNextListeners() {
  if (nextListeners === currentListeners) {
    nextListeners = currentListeners.slice(); //生成一个新的数组
  }
}

function subscribe(listener) {
  if (typeof listener !== "function") {
    throw new Error("Expected listener to be a function.");
  }

  var isSubscribed = true;

  ensureCanMutateNextListeners();
  nextListeners.push(listener);

  return function unsubscribe() {
    if (!isSubscribed) {
      return;
    }

    isSubscribed = false;

    ensureCanMutateNextListeners();
    var index = nextListeners.indexOf(listener);
    nextListeners.splice(index, 1);
  };
}
```

可以发现，上面的源码使用 currentListeners 和 nextListeners 两个数组来保存，主要原因是在 dispatch 函数中会遍历 nextListeners，这时候可能会客户可能会继续调用 subscribe 插入 listener，为了保证遍历时 nextListeners 不变化，需要一个临时的数组保存。

### dispatch

当 view dispatch 一个 action 后，就会调用此 action 对应的 reducer，下面是它的源码：

```js
    function dispatch(action) {
        ...
      try {
            isDispatching = true
          currentState = currentReducer(currentState, action)  //调用reducer处理
        } finally {
            isDispatching = false
        }

        var listeners = currentListeners = nextListeners
        for (var i = 0; i < listeners.length; i++) {
            var listener = listeners[i]
          listener()
        }
      ...
    }
```

从上面的源码可以发现，dispatch 函数在调用了 currentReducer 以后，遍历 nextListeners 数组，回调所有通过 subscribe 注册的函数，这样在每次 store 数据更新，组件就能立即获取到最新的数据。

### replaceReducer

replaceReducer 是切换当前的 reducer，虽然代码只有几行，但是在用到时功能非常强大，它能够实现代码热更新的功能，即在代码中根据不同的情况，对同一 action 调用不同的 reducer，从而得到不同的数据。

```js
function replaceReducer(nextReducer) {
  if (typeof nextReducer !== "function") {
    throw new Error("Expected the nextReducer to be a function.");
  }

  currentReducer = nextReducer;
  dispatch({ type: ActionTypes.REPLACE });
}
```

## bindActionCreators

bindActionCreators 方法的目的就是简化 action 的分发，我们在触发一个 action 时，最基本的调用是 dispatch(action(param))。这样需要在每个调用的地方都写 dispatch，非常麻烦。bindActionCreators 就是将 action 封装了一层，返回一个封装过的对象，此后我们要出发 action 时直接调用 action(param)就可以了。

# react-redux

redux 作为一个通用的状态管理库，它不只针对 react，还可以作用于其它的像 vue 等。因此 react 要想完美的应用 redux，还需要封装一层，react-redux 就是此作用。react-redux 库相对简单些，它提供了一个 react 组件 Provider 和一个方法 connect。下面是 react-redux 最简单的写法：

```js
    import { Provider } from 'react-redux';     // 引入 react-redux

    ...
    render(
          <Provider store={store}>
            <Sample />
        </Provider>,
        document.getElementById('app'),
    );

```

connect 方法复杂点，它返回一个函数，此函数的功能是创建一个 connect 组件包在 WrappedComponent 组件外面，connect 组件复制了 WrappedComponent 组件的所有属性，并通过 redux 的 subscribe 方法注册监听，当 store 数据变化后，connect 就会更新 state，然后通过 mapStateToProps 方法选取需要的 state，如果此部分 state 更新了，connect 的 render 方法就会返回新的组件。

```js
    export default function connect(mapStateToProps, mapDispatchToProps, mergeProps, options = {}) {
        ...
      return function wrapWithConnect(WrappedComponent) {
          ...
      }
    }

```

## 最后

[【转自掘金】](https://juejin.im/post/5b5fa8c26fb9a04fd65964d0)
