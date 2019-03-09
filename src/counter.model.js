import { useState } from "react";

const useCounter = initialCount => {
  const [count, setCount] = useState(initialCount);
  return {
    value: count,
    increase:(step)=> () => setCount(prevCount => prevCount + step),
    decrease: (step)=>() => setCount(prevCount => prevCount - step),
    reset: () => setCount(initialCount)
  };
};

export default useCounter;