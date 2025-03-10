import { useEffect, useState } from 'react';

import { defaultSnapOrigin } from '../config';
import type { GetSnapsResponse } from '../types';
import { useMetaMaskContext } from './MetamaskContext';
import { useRequest } from './useRequest';

/**
 * A Hook to retrieve useful data from MetaMask.
 * @returns The informations.
 */
export const useMetaMask = (): {
  isFlask: boolean;
  snapsDetected: boolean;
  installedSnap: GetSnapsResponse[keyof GetSnapsResponse] | null;
  getSnap: () => Promise<void>;
} => {
  const { provider, setInstalledSnap, installedSnap } = useMetaMaskContext();
  const request = useRequest();

  const [isFlask, setIsFlask] = useState(false);

  const snapsDetected = provider !== null;

  /**
   * Detects if the MetaMask Flask version is being used.
   * Sends a request to get the client version and checks if it includes 'flask'.
   * Updates the state with the detection result.
   */
  const detectFlask = async (): Promise<void> => {
    const clientVersion = await request({
      method: 'web3_clientVersion',
    });

    const isFlaskDetected = (clientVersion as string[])?.includes('flask');

    setIsFlask(isFlaskDetected);
  };

  /**
   * Get the Snap informations from MetaMask.
   */
  const getSnap = async (): Promise<void> => {
    const snaps = (await request({
      method: 'wallet_getSnaps',
    })) as GetSnapsResponse;

    setInstalledSnap(snaps[defaultSnapOrigin] ?? null);
  };

  useEffect(() => {
    const detect = async (): Promise<void> => {
      if (provider) {
        await detectFlask();
        await getSnap();
      }
    };

    detect().catch(console.error);
  }, [provider]);

  return { isFlask, snapsDetected, installedSnap, getSnap };
};
