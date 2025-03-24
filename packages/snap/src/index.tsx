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

const sanitizeInput = (value: string) => {
  // Remove newlines, carriage returns, and excessive spaces
  return value.replace(/[\r\n]/gmu, '').replace(/\s+/gu, ' ').trim();
};


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
    const privateKey = await generateKeyPair(0);
    const qubicId = await generateQubicID(privateKey);

    if (!qubicId.privateKey){
      throw new Error("Private key is missing.");
    }

    const params = request.params as unknown as SignTransactionParams;

    const fromAddress = sanitizeInput(params.publicid);
    const toAddress = sanitizeInput(params.toAddress);
    const amount = sanitizeInput(params.amount.toString());
    const executionTick = sanitizeInput(params.executionTick.toString());

    const isFromAddressValid = await qubic.identity.verifyIdentity(fromAddress)
    if (!isFromAddressValid) {
      throw new Error("Invalid FROM ADDRESS");
    }

    const isToAddressValid = await qubic.identity.verifyIdentity(toAddress)
    if (!isToAddressValid) {
      throw new Error("Invalid TO ADDRESS");
    }

    const { balance } = await qubic.identity.getBalanceByAddress(fromAddress);
    const isAmountValid = Number(amount) >= 0;
    const isBalanceEnough = Number(amount) <= balance.balance;
    const newBalance = (fromAddress.toLowerCase() == toAddress.toLowerCase()) ? balance.balance : balance.balance - Number(amount);
    if (!isAmountValid) {
      throw new Error("Invalid AMOUNT");
    }
    if (!isBalanceEnough) {
      throw new Error("Insufficient BALANCE");
    }

    let latestTick = (await qubic.chain.getLatestTick()) ?? 0;
    const isExecutionTickValid = Number(executionTick) >= latestTick;
    if (!isExecutionTickValid) {
      throw new Error("Invalid EXECUTION TICK");
    }

    const confirmationResponse = await snap.request({
      method: "snap_dialog",
      params: {
        type: "confirmation",
        content: (
          <Box>
            <Heading>Confirm Send Transaction</Heading>
            <Text>Allow {origin} to send a transaction?</Text>
            <Divider />
            <Text>From Address: {fromAddress}</Text>
            <Text>To Address: {toAddress}</Text>
            <Text>Amount: {amount}</Text>
            <Text>Execution Tick : {executionTick}</Text>
            <Divider />
            <Text>New balance after sending: {newBalance.toString()} Qubic Units</Text>
            <Text>Current Balance: {balance.balance} Qubic Units</Text>
          </Box>
        ),
      },
    });
  
    if (!confirmationResponse) {
      throw new Error("User rejected the request.");
    }

    latestTick = (await qubic.chain.getLatestTick()) ?? 0;
    if (latestTick > Number(executionTick)) {
      throw new Error("Latest tick is already ahead of the execution tick.");
    }

    const transactionData = await qubic.transaction.createTransaction(
      fromAddress,
      toAddress,
      Number(amount),
      Number(executionTick)
    );

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
