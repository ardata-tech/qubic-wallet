import { getBIP44AddressKeyDeriver } from '@metamask/key-tree'
import Qubic from "@ardata-tech/qubic-js";

// Singleton Qubic instance
let qubicInstance = null;

// Function to get the Qubic instance
const getQubicInstance = () => {
  if (!qubicInstance) {
    qubicInstance = new Qubic({
      providerUrl: "https://rpc.qubic.org",
      version: 1,
    });
  }
  return qubicInstance;
}

export const generateKeyPair = async (accountIndex) => {
  // Get the Qubic instance
  const qubic = getQubicInstance();

  // Set coin type
  const coinType = 83293 // 1 for testing

  // Get the BIP44 node
  const bip44Node = await snap.request({
    method: 'snap_getBip44Entropy',
    params: { coinType },
  })

  // Get the key deriver function
  const deriveAccountAddress = await getBIP44AddressKeyDeriver(bip44Node)

  // Derive the new account, index starts with 0
  const newAccount = await deriveAccountAddress(accountIndex)

  // Convert the private key to base26
  const privateKeyBase26 = qubic.utils.hexToBase26(newAccount.privateKey)

  // use QubicHelper to get public key
  const identity = await qubic.identity.createIdentity(privateKeyBase26);

  return {
    publicKey: identity.publicKey,
    privateKey: identity.privateKey,
    publicId: identity.publicId,
  }
}

export const generateKeyPairFromPrivateKey = async (privateKey) => {
  // Get the Qubic instance
  const qubic = getQubicInstance();

  // Convert the private key to base26
  const privateKeyBase26 = qubic.utils.hexToBase26(privateKey)

  // Create an identity package from the private key
  const identity = await qubic.identity.createIdentityFromPrivateKey(privateKeyBase26);

  return {
    publicKey: identity.publicKey,
    privateKey: identity.privateKey,
    publicId: identity.publicId,
  }
}

export const signTransaction = async (transactionData, privateKey) => {
  // Get the Qubic instance
  const qubic = getQubicInstance();

  // Sign the transaction data
  const signedTransaction = await qubic.identity.signTransaction(transactionData, privateKey);

  return signedTransaction;
}
