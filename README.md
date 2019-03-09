
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

