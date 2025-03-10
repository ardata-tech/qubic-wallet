import { useState, useEffect } from 'react';
import Qubic from '@ardata-tech/qubic-js';


interface IHealthCheck {
  status: boolean;
}


interface UsePollingResult {
  data: IHealthCheck | null;
  error: Error | null;
}

const useQubicHealthPolling = (
  fastInterval: number = 10000,
  slowInterval: number = 60000,
): UsePollingResult => {
  const [data, setData] = useState<IHealthCheck | null>(null);
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
        .then((response: IHealthCheck | null) => {
          if (isMounted) {
            setData(response);
            setError(null);
            setIntervalTime(true ? fastInterval : slowInterval);
          }
        })
        .catch((err: unknown) => {
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
