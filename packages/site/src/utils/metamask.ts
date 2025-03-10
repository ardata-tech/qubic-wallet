import type {
  EIP6963AnnounceProviderEvent,
  MetaMaskInpageProvider,
} from '@metamask/providers';

/**
 * Checks if a MetaMask provider supports Snaps.
 * @param provider - The MetaMask provider to check. Defaults to the global
 * `window.ethereum` provider.
 * @returns `true` if the provider supports Snaps, `false` otherwise.
 */
export async function hasSnapsSupport(
  provider: MetaMaskInpageProvider = window.ethereum,
): Promise<boolean> {
  try {
    await provider.request({
      method: 'wallet_getSnaps',
    });

    return true;
  } catch {
    return false;
  }
}

/**
 * Gets the MetaMask provider supporting EIP-6963.
 * Listens for `eip6963:announceProvider` events and resolves the promise with the
 * first provider that announces itself with an `info.rdns` that includes
 * `io.metamask`.
 * If no provider announces itself within 500ms, the promise resolves to `null`.
 * @returns The MetaMask provider supporting EIP-6963, or `null` if none is found.
 */
export async function getMetaMaskEIP6963Provider(): Promise<MetaMaskInpageProvider | null> {
  return new Promise<MetaMaskInpageProvider | null>((rawResolve) => {
    // Timeout looking for providers after 500ms
    const timeout = setTimeout(() => {
      resolve(null);
    }, 500);
    /**
     * Resolves the promise with the provided MetaMask provider or `null`.
     * Removes the event listener for `eip6963:announceProvider` and clears
     * the timeout set for provider detection.
     * @param provider - The MetaMask provider to resolve with, or `null` if no provider is found.
     */
    function resolve(provider: MetaMaskInpageProvider | null): void {
      window.removeEventListener(
        'eip6963:announceProvider',
        onAnnounceProvider,
      );
      clearTimeout(timeout);
      rawResolve(provider);
    }

    /**
     * Listens for `eip6963:announceProvider` events and resolves the promise with
     * the first provider that announces itself with an `info.rdns` that includes
     * `io.metamask`.
     * @param event - The event object.
     * @param event.detail - The `eip6963:announceProvider` event details.
     */
    function onAnnounceProvider({
      detail,
    }: EIP6963AnnounceProviderEvent): void {
      if (!detail) {
        // If the event detail is missing, do nothing.
        return;
      }

      const { info, provider } = detail;

      if (info.rdns.includes('io.metamask')) {
        // If the provider has an `info.rdns` that includes `io.metamask`,
        // resolve the promise with that provider.
        resolve(provider);
      }
    }

    window.addEventListener('eip6963:announceProvider', onAnnounceProvider);

    window.dispatchEvent(new Event('eip6963:requestProvider'));
  });
}

/**
 * Finds and returns the MetaMask provider that supports Snaps.
 * First, it checks if the global `window.ethereum` provider supports Snaps.
 * If it does, it returns the global provider.
 * If the global provider does not support Snaps, it checks the `detected` and
 * `providers` properties of the global provider and returns the first provider
 * that announces support for Snaps.
 * If no provider announces support for Snaps, it uses
 * `getMetaMaskEIP6963Provider` to find and return a provider that supports
 * EIP-6963 and Snaps.
 * If it fails to find a provider that supports Snaps, it returns `null`.
 * @returns The MetaMask provider that supports Snaps, or `null` if none is found.
 */
export async function getSnapsProvider(): Promise<MetaMaskInpageProvider | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  if (await hasSnapsSupport()) {
    return window.ethereum;
  }

  if (window.ethereum?.detected) {
    for (const provider of window.ethereum.detected) {
      if (await hasSnapsSupport(provider)) {
        return provider;
      }
    }
  }

  if (window.ethereum?.providers) {
    for (const provider of window.ethereum.providers) {
      if (await hasSnapsSupport(provider)) {
        return provider;
      }
    }
  }

  const eip6963Provider = await getMetaMaskEIP6963Provider();

  if (eip6963Provider && (await hasSnapsSupport(eip6963Provider))) {
    return eip6963Provider;
  }

  return null;
}
