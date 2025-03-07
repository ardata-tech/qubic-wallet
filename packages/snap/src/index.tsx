/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { OnRpcRequestHandler } from '@metamask/snaps-sdk';
import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';
import { Box, Text, Bold } from '@metamask/snaps-sdk/jsx';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */

const generateKeyPair = async (accountIndex: any) => {
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

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case 'getPublicId': {
      // Extract the parameters from the request
      const response = await generateKeyPair(0);
      // Return the public ID
      return JSON.stringify(response);
    }
    default:
      throw new Error('Method not found.');
  }
};
