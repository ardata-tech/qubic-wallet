import { getBIP44AddressKeyDeriver } from "@metamask/key-tree";

// Singleton Qubic instance
let qubicInstance:any = null;

// Function to get the Qubic instance

// export const createTransaction = async ({ to, from, amount, tick }:any) => {
//   const qubic = getQubicInstance();
//   return await qubic.transaction.createTransaction(from, to, amount, tick);
// };

export const generateKeyPair = async (accountIndex:any) => {
  // Get the Qubic instance
  //const qubic = getQubicInstance();
  // try {
  // const qubic = new Qubic({
  //   providerUrl: 'https://rpc.qubic.org',
  //   version: 1,
  // });
  // } catch (error) {
  //   console.log('error', error);
  // }

  // // Set coin type
  const coinType = 83293; // 1 for testing
  //const coinType = 3; // 1 for testing

  // // Get the BIP44 node
  const bip44Node = await snap.request({
    method: 'snap_getBip44Entropy',
    params: { coinType },
  });

  // // Get the key deriver function
  const deriveAccountAddress = await getBIP44AddressKeyDeriver(bip44Node);

  // // Derive the new account, index starts with 0
  const newAccount = await deriveAccountAddress(accountIndex);

  console.log('newAccount', newAccount);

  // // Convert the private key to base26
  // const privateKeyBase26 = qubic.utils.hexToBase26(newAccount.privateKey);

  // // use QubicHelper to get public key
  // const identity = await qubic.identity.createIdentity(privateKeyBase26);

  return {
    privateKey: newAccount.privateKey,
  };
};

// export const generateKeyPairFromPrivateKey = async (privateKey:string) => {
//   // Get the Qubic instance
//   const qubic = getQubicInstance();

//   // Convert the private key to base26
//   const privateKeyBase26 = qubic.utils.hexToBase26(privateKey);

//   // Create an identity package from the private key
//   const identity = await qubic.identity.createIdentityFromPrivateKey(
//     privateKeyBase26
//   );

//   return {
//     publicKey: identity.publicKey,
//     privateKey: identity.privateKey,
//     publicId: identity.publicId,
//   };
// };

// export const signTransaction = async (transactionData:any, privateKey:any) => {
//   // Get the Qubic instance
//   const qubic = getQubicInstance();

//   // Sign the transaction data

//   const signedTransaction = await qubic.transaction.signTransaction(
//     transactionData,
//     privateKey
//   );
//   return signedTransaction;
// };

