import React from "react";
import useCounter from './counter.model.js'
import {connect} from 'reday'
import CounterOrigin from './counter.render'

//connect为原始的counter组件，组合属性
const Counter=connect((props)=>{
  const counter = useCounter(props.initialCount);
  return {
    ...counter
  }  
})(CounterOrigin)

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
