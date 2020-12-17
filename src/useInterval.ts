import { useEffect, useState } from 'react';

const useInterval = (timeout: number) => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((counter) => counter + 1);
    }, timeout);
    return () => clearInterval(interval);
  }, [timeout]);

  return counter;
};

export default useInterval;
