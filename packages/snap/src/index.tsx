import type { OnRpcRequestHandler } from '@metamask/snaps-sdk';
import { Box, Text, Bold } from '@metamask/snaps-sdk/jsx';
import { generateKeyPair } from './qubic/QubicService';

// import {
//   generateKeyPair,
//   signTransaction,
//   createTransaction,
// } from './qubic/QubicService';


// import { renderGetPublicKey, generateTransaction } from './qubic/SnapService';
// import {
//   assertInput,
//   assertConfirmation,
//   assertIsString,
//   assertIsInt,
//   assertIsBoolean,
// } from './qubic/ValidatorHelper';


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
    case 'hello':
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: (
            <Box>
              <Text>
                Hello, <Bold>{origin}</Bold>!
              </Text>
              <Text>
                This custom confirmation is just for display purposes.
              </Text>
              <Text>
                But you can edit the snap source code to make it do something,
                if you want to!
              </Text>
            </Box>
          ),
        },
      });
    
    
    
    case 'hi':
      return 'hello world'
    case 'getPublicId': 
      // Extract the parameters from the request
      const response = await generateKeyPair(0);
      // Return the public ID
      return JSON.stringify(response)
    default:
     throw new Error('Method not found.');
   }
};
