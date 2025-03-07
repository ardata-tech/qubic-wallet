import { useState, useEffect } from 'react';
import Qubic from '@ardata-tech/qubic-js';

interface UsePollingResult<T> {
  data: T | null;
  error: Error | null;
}

const useQubicHealthPolling = <T,>(
  fastInterval: number = 10000,
  slowInterval: number = 60000,
): UsePollingResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [intervalTime, setIntervalTime] = useState<number>(fastInterval);

  useEffect(() => {
    let isMounted = true;

    const qubic = new Qubic({
      providerUrl: 'https://rpc.qubic.org',
      version: 1,
    });

    const fetchData = async () => {
      qubic.chain
        .getHealthCheck()
        .then((response: any) => {
          if (isMounted) {
            setData(response);
            setError(null);
            setIntervalTime(true ? fastInterval : slowInterval);
          }
        })
        .catch((err: any) => {
          if (isMounted) {
            setData(null);
            setError(err instanceof Error ? err : new Error(String(err)));
          }
        });
    };

    fetchData();
    const intervalId = setInterval(fetchData, intervalTime);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [intervalTime]);

  return { data, error };
};

export default useQubicHealthPolling;
