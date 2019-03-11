import React from 'react'

//initialCount属性是给model的，由connect组合属性
export default function Counter({ step ,value,increase,reset}) {
  return (
    <div>
    <p>You clicked {value} times(step:{step})</p>
    <button onClick={increase(step)}>
      Click me
    </button>
    <button onClick={reset}>Reset</button>
  </div>
  );
}