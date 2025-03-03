import {
  generateKeyPair,
  signTransaction,
  createTransaction,
} from "./QubicService";
import {
  renderGetPublicKey,
  generateTransaction,
} from "./SnapService";
import {
  assertInput,
  assertConfirmation,
  assertIsString,
  assertIsInt,
  assertIsBoolean,
} from "./ValidatorHelper";

/**
 * Handle incoming JSON-RPC requests from the dapp, sent through the
 * `wallet_invokeSnap` method. This handler handles all available methods:
 *
 * @param params - The request parameters.
 * @param params.request - The JSON-RPC request object.
 * @returns The JSON-RPC response.
 * @see https://docs.metamask.io/snaps/reference/exports/#onrpcrequest
 * @see https://docs.metamask.io/snaps/reference/rpc-api/#wallet_invokesnap
 */
export const onRpcRequest = async ({ origin, request }) => {
  const dappHost = new URL(origin)?.host;

  switch (request.method) {
    case "createTransactionAndSign": {
      const {
        accountIdx = 0,
        confirm = false,
        to = "",
        amount = 0,
        tick = 0,
      } = request.params || {};
      assertIsBoolean(confirm);
      const { publicId, privateKey } = await generateKeyPair(accountIdx);
      const params = { to, from: publicId, amount, tick };

      if (confirm) {
        // Render the confirmation UI
        const accepted = await generateTransaction(dappHost, params);
        // If the user rejected the request, throw an error
        assertConfirmation(accepted);
      }

      //create transaction
      const tx = await createTransaction(params);

      //sign transaction
      const signedTransaction = await signTransaction(tx, privateKey);

      //encode to base64
      const signedTransactionBase64 = btoa(
        String.fromCharCode(...signedTransaction)
      );

      return signedTransactionBase64;
    }

    // Handle the `getPublicId` method
    case "getPublicId": {
      // Extract the parameters from the request
      const { accountIdx = 0, confirm = false } = request.params || {};

      // Validate the parameters
      assertIsBoolean(confirm);

      // Generate a new key pair
      const { publicId } = await generateKeyPair(accountIdx);

      // If the user needs to confirm the request, render the confirmation UI
      if (confirm) {
        // Render the confirmation UI
        const accepted = await renderGetPublicKey(dappHost, publicId);
        // If the user rejected the request, throw an error
        assertConfirmation(accepted);
      }

      // Return the public ID
      return publicId;
    }


    // Handle the default case
    default:
      // Throw an error if the requested method is not supported
      throw {
        code: 4200,
        message: "The requested method is not supported.",
      };
  }
};
