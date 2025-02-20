import { getBIP44AddressKeyDeriver } from '@metamask/key-tree'
import Qubic from "@ardata-tech/qubic-js";

export const generateKeyPair = async (accountIndex) => {
  // Initialize the Qubic instance with the provider URL
  const qubic = new Qubic({
    providerUrl: "https://rpc.qubic.org",
    version: 1,
  });

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
  const idPack = await qubic.identity.createIdPackage(seed);

  return {
    privateKey: privateKeyBase26,
    publicId: idPack.publicId,
  }
}
