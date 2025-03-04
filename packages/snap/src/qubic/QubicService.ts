// eslint-disable-next-line import/no-extraneous-dependencies
import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';

export const generateKeyPair = async (accountIndex: any) => {
  // Set coin type
  const coinType = 83293; // 1 for testing

  // Get the BIP44 node
  const bip44Node = await snap.request({
    method: 'snap_getBip44Entropy',
    params: { coinType },
  });

  // // Get the key deriver function
  const deriveAccountAddress = await getBIP44AddressKeyDeriver(bip44Node);

  // // Derive the new account, index starts with 0
  const newAccount = await deriveAccountAddress(accountIndex);

  return {
    privateKey: newAccount.privateKey,
  };
};
