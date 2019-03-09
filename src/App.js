import React, { useState } from "react";

//1. 创建自定义的hook
//一般原则：如果返回值是两个，可以考虑返回数组，这样使用时可以自行命名，类似useState
//若大于两个，由于顺序问题难以记忆，我们应如下方，返回object
const useCounter = initialCount => {
  const [count, setCount] = useState(initialCount);
  return {
    value: count,

    //演示需要参数的函数
    increase:(step)=> () => setCount(prevCount => prevCount + step),
    
    //演示不需要参数的函数
    reset: () => setCount(initialCount)
  };
};

//1. 创建counter组件
function Counter({ initialCount,step }) {

  //问题1 违背原则：组件仅根据传入的属性呈现
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

//问题2 自定义hook复用useCounter逻辑,而不是共享实例，我们有时需要共享实例
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
