import Crypto from '@qubic-lib/qubic-ts-library/dist/crypto'
import { QubicHelper } from '@qubic-lib/qubic-ts-library/dist/qubicHelper'
import { renderGetPublicKey, renderSignTransaction } from './SnapService'
import { generateKeyPair, generateKeyPairFromPrivateKey } from './QubicService'
import { assertInput, assertConfirmation, assertIsString, assertIsInt, assertIsBoolean } from './ValidatorHelper'

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
  const dappHost = (new URL(origin))?.host

  switch (request.method) {
    // Handle the `getPublicId` method
    case 'getPublicId': {
      // Extract the parameters from the request
      const { accountIdx = 0, confirm = false } = request.params || {}
      // Validate the parameters
      assertIsBoolean(confirm)
      // Generate a new key pair
      const { publicId } = await generateKeyPair(accountIdx)
      // If the user needs to confirm the request, render the confirmation UI
      if (confirm) {
        // Render the confirmation UI
        const accepted = await renderGetPublicKey(dappHost, publicId)
        // If the user rejected the request, throw an error
        assertConfirmation(accepted)
      }

      // Return the public ID
      return publicId
    }

    // Handle the `signTransaction` method
    case 'signTransaction': {
      // Extract the parameters from the request
      const { base64Tx, offset, accountIdx = 0, confirm = true } = request.params || {}

      // Validate the parameters
      assertInput(base64Tx)
      assertIsString(base64Tx)
      assertInput(offset)
      assertIsInt(offset)

      // Convert the base64 string to a binary buffer
      const binaryTx = atob(base64Tx)
      const tx = new Uint8Array(binaryTx.length)
      for (let i = 0; i < binaryTx.length; i++) {
        tx[i] = binaryTx.charCodeAt(i)
      }

      // If the user needs to confirm the request, render the confirmation UI
      if (confirm) {
        // Render the confirmation UI
        const accepted = await renderSignTransaction(dappHost, base64Tx)
        // If the user rejected the request, throw an error
        assertConfirmation(accepted)
      }

      // const qHelper = new QubicHelper()
      // const qCrypto = await Crypto
      // const { privateKey } = await generateKeyPair(accountIdx)
      // const digest = new Uint8Array(qHelper.DIGEST_LENGTH)
      // const toSign = tx.slice(0, offset)
      // qCrypto.K12(toSign, digest, qHelper.DIGEST_LENGTH)
      // const idPackage = await generateKeyPairFromPrivateKey(privateKey)
      // const signedTx = qCrypto.schnorrq.sign(idPackage.privateKey, idPackage.publicKey, digest)
      // const signedTxBase64 = btoa(String.fromCharCode(...signedTx))

      // Return the signed transaction
      return {
        signedTx: signedTxBase64
      }
    }

    // Handle the default case
    default:
      // Throw an error if the requested method is not supported
      throw {
        code: 4200,
        message: 'The requested method is not supported.'
      }
  }
}
