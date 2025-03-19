/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { OnRpcRequestHandler } from '@metamask/snaps-sdk';
import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';
import { Box, Heading, Text, Divider } from "@metamask/snaps-sdk/jsx";
import Qubic from '@ardata-tech/qubic-js';

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

interface SignTransactionParams {
  publicid: string;
  toAddress: string;
  amount: number;
  executionTick: number;
}

const qubic = new Qubic({
  providerUrl: 'https://rpc.qubic.org',
  version: 1,
});

const generateKeyPair = async (accountIndex: number) => {
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
  return newAccount.privateKey;
};

const generateQubicID = async (privateKey: string | undefined) => {
  if (privateKey !== undefined) {
    const privateKeyBase26 = qubic.utils.hexToBase26(privateKey);
    const identity = await qubic.identity.createIdentity(
      privateKeyBase26,
    );
    return {privateKey: identity.privateKey, publicKey: identity.publicKey, publicId: identity.publicId};
  }
  return {privateKey: undefined, publicKey: undefined, publicId: undefined}; // or handle error appropriately
}


export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
  if (request.method == 'getPublicId') {
    const confirmationResponse = await snap.request({
      method: "snap_dialog",
      params: {
        type: "confirmation",
        content: (
          <Box>
            <Heading>Confirm Wallet Access</Heading>
            <Text>Allow {origin} to access your Qubic ID?</Text>
          </Box>
        ),
      },
    });
  
    if (!confirmationResponse) {
      throw new Error("User rejected the request.");
    }

    const privateKey = await generateKeyPair(0);
    const qubicId = await generateQubicID(privateKey);

    // Return the public ID without exposing the private key
    return JSON.stringify({privateKey: undefined, publicKey: qubicId.publicKey, publicId: qubicId.publicId}); 
  }
  else if (request.method == 'signTransaction') {
    const params = request.params as unknown as SignTransactionParams;

    // return JSON.stringify(params)
    const confirmationResponse = await snap.request({
      method: "snap_dialog",
      params: {
        type: "confirmation",
        content: (
          <Box>
            <Heading>Confirm Send Transaction</Heading>
            <Text>Allow {origin} to send a transaction?</Text>
            <Divider />
            <Text>From Address: {params.publicid}</Text>
            <Text>To Address: {params.toAddress}</Text>
            <Text>Amount: {params.amount.toString()}</Text>
            <Text>Execution Tick : {params.executionTick.toString()}</Text>
          </Box>
        ),
      },
    });
  
    if (!confirmationResponse) {
      throw new Error("User rejected the request.");
    }

    const transactionData = await qubic.transaction.createTransaction(
      params.publicid,
      params.toAddress,
      params.amount,
      params.executionTick
    );

    const privateKey = await generateKeyPair(0);
    const qubicId = await generateQubicID(privateKey);

    if (!qubicId.privateKey){
      throw new Error("Private key is missing.");
    }

    const signedTransaction = await qubic.transaction.signTransaction(
      transactionData,
      qubicId.privateKey,
    );

    const signedTransactionBase64 =
      qubic.transaction.encodeTransactionToBase64(signedTransaction);

    const result = await qubic.transaction.broadcastTransaction(
      signedTransactionBase64,
    );

    return JSON.stringify({result}); 
  }
  else {
    throw new Error('Method not found.');
  }
};
