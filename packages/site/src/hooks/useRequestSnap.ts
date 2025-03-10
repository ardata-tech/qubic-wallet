import { defaultSnapOrigin } from '../config';
import type { Snap } from '../types';
import { useMetaMaskContext } from './MetamaskContext';
import { useRequest } from './useRequest';

/**
 * Utility hook to wrap the `wallet_requestSnaps` method.
 * @param snapId - The requested Snap ID. Defaults to the snap ID specified in the
 * config.
 * @param version - The requested version.
 * @returns The `wallet_requestSnaps` wrapper.
 */
export const useRequestSnap = (
  snapId = defaultSnapOrigin,
  version?: string,
): () => Promise<void> => {
  const request = useRequest();
  const { setInstalledSnap } = useMetaMaskContext();

  /**
   * Requests the specified Snap to be installed or updated.
   * Sends a request to `wallet_requestSnaps` with the provided Snap ID and optional version.
   * Updates the `installedSnap` context variable upon successful installation or update.
   */
  const requestSnap = async (): Promise<void> => {
    const snaps = (await request({
      method: 'wallet_requestSnaps',
      params: {
        [snapId]: version ? { version } : {},
      },
    })) as Record<string, Snap>;

    // Updates the `installedSnap` context variable since we just installed the Snap.
    setInstalledSnap(snaps?.[snapId] ?? null);
  };

  return requestSnap;
};
