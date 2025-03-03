/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { OnRpcRequestHandler } from '@metamask/snaps-sdk';
import { Box, Text, Bold } from '@metamask/snaps-sdk/jsx';
import { generateKeyPair } from './qubic/QubicService';
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
