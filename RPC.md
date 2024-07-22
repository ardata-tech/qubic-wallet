# RPC Methods

### getPublicId

Returns the wallet's Qubic public key.

#### Parameters

Param object containing:

- `accountIdx` - The account index starting with 0.
- `confirm` - Whether to show a confirm dialog.

#### Returns

Public ID.

Example:

```javascript
ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: 'npm:@qubic-lib/qubic-mm-snap',
    request: {
      method: 'getPublicId',
      params: {
        accountIdx: 0,
        confirm: true
      }
   }
  }
});
```

### signTransaction

Sign a transaction and return the signature encoded as Base64.

#### Parameters

Param object containing:

- `base64Tx` - Transaction encoded as Base64
- `offset` - Offset of the transaction in the message
- `accountIdx` - Account index starting with 0
- `confirm` - Boolean whether to show a confirm dialog.

#### Returns

An object containing:

- `signedTx` - Transaction signature encoded as Base64

Example:

```javascript
ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: 'npm:@qubic-lib/qubic-mm-snap',
    request: {
      method: 'signTransaction',
      params: {
        base64Tx: '...',
        offset: 96,
        accountIdx: 0,
        confirm: true
      }
   }
  }
});
```
