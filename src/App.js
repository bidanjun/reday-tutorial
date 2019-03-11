import React from "react";
import useCounter from './counter.model.js'
import { connect, compose, delay, useAsyncState, wait } from 'reday'
import CounterOrigin from './counter.render'

//connect为原始的counter组件，组合属性
const Counter = connect((props) => {
  const counter = useCounter(props);
  return {
    ...counter
  }
})(CounterOrigin)


//CounterWithLoading，使用wait hoc,为原始组件预先得到初始状态
const resetAsync = async (props) => {
  await delay(1000)
  return 10; //这里应该返回一个值，即resolved,该值会作为属性传递给组件
  //这只是一个异步函数，没有执行setState(10)，返回10，默认为组件增加{resolved:10}属性
  //我们可以使用mapProps将其转换成{initialState:0}
}

const CounterWithLoading = compose(
  wait(resetAsync, true, true, (resolved) => ({ initialState: resolved })),
  connect((props) => {
    console.log('CounterWithLoading props:',props)
    const counter = useCounter(props);
    return {
      ...counter
    }
  })
)(CounterOrigin)


//此时Counter组件包含了useCounter赋予的属性
export default function App() {
  return (
    <div >
      <h1>Counter use React hook </h1>

      <h2>use connect,step=1</h2>
      <Counter initialState={0} step={1}/>

      <h2>use wait for load initialState,step=2</h2>
      <CounterWithLoading initialState={0} step={2}/>


    </div>
  );
}
