import { useState } from "react";
import {delay} from 'reday'

//自定义hooks约定使用props,没有props参数的自定义hook，使用withProps访问props
const useCounter = ({ initialState}) => {
  const defaulState=0;
  
  //当initialState=0的时候，这里返回defaultState,同样是0
  const [state, setState] = useState(initialState || defaulState);

  const resetAsync = async () => {
    await delay(1000)
    return 10; //这里应该返回一个值，即resolved,该值会作为属性传递给组件
    //这只是一个异步函数，没有执行setState(10)，返回10，默认为组件增加{resolved:10}属性
    //我们可以使用mapProps将其转换成{initialState:0}
  }

  return {
    value: state,
    increase:(step)=> () => setState(prevState => prevState + step),
    decrease: (step)=>() => setState(prevState => prevState - step),
    reset: () => setState(initialState),
    resetAsync
  };
};

export default useCounter;