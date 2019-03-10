## 概述
1. react hooks为函数型组件，提供useState、useEffect等，处理状态和部分生命周期
1. 复杂的问题简单化，我们设计组件，只需要根据属性，呈现组件
      因此，组件的设计，不依赖外部的数据和逻辑，我们只需要考虑组件内部的呈现，以及需要提供的属性
      使用useState需要在函数组件中签入这些，因此我们提供connect hoc,用于分离业务和呈现
1. useState共享逻辑，但并不共享实例
    换言之，自定义的hook，在不同组件使用时，彼此是独立的。
    我们有时需要类似全局状态的方式，即共享实例。
    因此reday 提供share/provider方式，在一颗组件树中共享业务逻辑。
    share为自定义hook提供可访问的函数变量，connect中可以使用useContext得到hooks，从而在整个组件树任意层级使用。
1. 处理异步函数
    包括预先载入数据、手动刷新数据、远程校验等，是常见的异步处理场景。
    这些场景同样存在共享逻辑和共享实例的问题。我们提供简易的wait机制，来处理异步操作。
1. model和状态
  redux之类，是管理全局状态的。相较于传统的model概念，其实过度设计，让事情复杂化。事实上，实际编程中，model是调用redux的状态管理实现的，换言之，对最终开发人员来说，redux增加了一个层次。
  前端的架构，完全可以参考服务端的传统三层架构，区别是服务端的数据层，数据来自数据库，前端的数据层，数据来自Rest之类的服务端。
  这样的好处，在web和mobile并存的情形下，手机应用本地的数据、web应用来自远端的数据，实际上是不同的数据层，类似服务端的不同数据库服务器，而model层则可共享，以至于经过精细规范后，react native的ui层亦可多数共享。
  因此reday的设计目标之一，就是同时应用于react native和react,data->model->view三个层面，对于web，data通常来自于rest，对于mobile，data可能来自rest也可能来自本地数据库。
1. api设计力求精简，完全兼容hooks的日常工作模式，主要包括以下
. connect 用于为组件组合属性
. share/provider，用于简化model的实例共享
. wait，用于在函数组件外部提供异步操作、亦可在jsx实时的执行。
. 少量工具：compose用于组合多个hoc,delay用于延时执行

##  如何使用
1. 使用create-react-app创建项目
. 打开命令提示符
  C:\WINDOWS\system32>d:

. 全局安装create-react-app
  D:\>npm install -g create-react-app

. 创建项目
  D:\>create-react-app reday-tutorial

. 进入项目所在目录
  D:\>cd reday-tutorial

. git操作
  在github创建reday-tutorial项目之后，建立与远程github项目的关联
  D:\reday-tutorial>git remote add origin https://github.com/bidanjun/reday-tutorial.git

. 推送到github
  D:\reday-tutorial>git push -u origin master

1. 安装reday
. 安装reday
  D:\reday-tutorial>npm install reday

. 签入之后，推送到远程服务器，然后创建一个标签
    D:\reday-tutorial>npm install reday
    D:\reday-tutorial>git tag -a v0.0.1_install_reday -m "install reday"
    D:\reday-tutorial>git push --tags

. git log查看一下，目前有两个提交
    D:\reday-tutorial>git log
    install reday
    Initial commit from Create React App

1. 约定：
  之后的例子以counter计数器为例，业务逻辑在src/counter.model.js,Counter组件在counter.render.js
  App组件在App.js,在此组合model和render
  
## 使用hook实现counter

1. 创建自定义的hook
import React, { useState } from "react";

//自定义的hook
const useCounter = initialCount => {
  const [count, setCount] = useState(initialCount);
  return {
    value: count,
    increase:(step)=> () => setCount(prevCount => prevCount + step),
    reset: () => setCount(initialCount)
  };
};

1. 创建counter组件
//组件
function Counter({ initialCount,step }) {

  //违背原则：仅传入属性
  const counter = useCounter(initialCount);

  return (
    <div>
    <p>step ={step} You clicked {counter.value} times</p>
    <button onClick={counter.increase(step)}>
      Click me
    </button>
    <button onClick={counter.reset}>Reset</button>
  </div>
  );
}

1.  自定义hook复用useCounter逻辑,而不是共享实例
//两个Counter组件，行为是独立的
//因此这里共享的是逻辑，而不是实例
export default function App() {
  return (
    <div >
      <h1>Counter use React hook </h1>
      <Counter initialCount={0} step={2}/>
      <Counter initialCount={0} step={1}/>
    </div>
  );
}

1. 问题：我们需要解决render和model分离、需要解决共享实例的问题


## 使用connect实现render和model的分离
1. 导入connect
    import {connect} from 'reday'

1. 修改Counter
  组件唯一的输入，应该是属性。提供不同的属性，呈现不同的UI和行为。
  由此我们可以将Counter组件独立出来，放置在counter.render.js
  import React from 'react';

  export default function Counter({ initialCount,step ,value,increase,reset}) {
    return (
      <div>
      <p>step ={step} You clicked {value} times</p>
      <button onClick={increase(step)}>
        Click me
      </button>
      <button onClick={reset}>Reset</button>
    </div>
    );
  }

1. 同样，useCounter自定义hook也可独立出来，放置在counter.model.js
  import React, { useState } from "react";

  //自定义的hook
  export default const useCounter = initialCount => {
    const [count, setCount] = useState(initialCount);
    return {
      value: count,
      increase:(step)=> () => setCount(prevCount => prevCount + step),
      reset: () => setCount(initialCount)
    };
  };

1. 在App.js里组合render和model
  import React from "react";
  import useCounter from './counter.model.js'
  import connect from 'reday'
  import CounterOrigin from './counter.render.js'

  //connect为原始的counter组件，组合属性
  Const Counter=connect((props)=>{
    const counter = useCounter(props.initialCount);
    return {
      ...counter
    }  
  })(Counter)

  //此时Counter组件包含了useCounter赋予的属性
  export default function App() {
    return (
      <div >
        <h1>Counter use React hook </h1>
        <Counter initialCount={0} step={2}/>
        <Counter initialCount={0} step={1}/>
      </div>
    );
  }

