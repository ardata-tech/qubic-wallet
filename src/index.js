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
    case 'getPublicId': {
      const { accountIdx = 0, confirm = false } = request.params || {}

      assertIsBoolean(confirm)

      const {publicId} = await generateKeyPair(accountIdx)

      if (confirm) {
        const accepted = await renderGetPublicKey(dappHost, publicId)
        assertConfirmation(accepted)
      }

      console.log('Public ID:', publicId)

      return publicId
    }

    case 'signTransaction': {
      const { base64Tx, offset, accountIdx = 0, confirm = true } = request.params || {}

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

      if (confirm) {
        const accepted = await renderSignTransaction(dappHost, base64Tx)
        assertConfirmation(accepted)
      }

      const qHelper = new QubicHelper()
      const qCrypto = await Crypto

      const { privateKey } = await generateKeyPair(accountIdx)
      const digest = new Uint8Array(qHelper.DIGEST_LENGTH)
      const toSign = tx.slice(0, offset)

      qCrypto.K12(toSign, digest, qHelper.DIGEST_LENGTH)

      const idPackage = await generateKeyPairFromPrivateKey(privateKey)
      const signedTx = qCrypto.schnorrq.sign(idPackage.privateKey, idPackage.publicKey, digest)
      const signedTxBase64 = btoa(String.fromCharCode(...signedTx))

      return {
        signedTx: signedTxBase64
      }
    }
    default:
      throw {
        code: 4200,
        message: 'The requested method is not supported.'
      }
  }
}
