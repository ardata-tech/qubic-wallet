# Qubic Connect Snap FAQ

## What is the Qubic Connect Snap?

The Qubic Connect Snap is a MetaMask extension that has Qubic capabilities such as public key derivation and transaction signing. This Snap is particularly useful when used with Qubic decentralized applications (DApps) that are built on top of the Snaps interface.

## How can end users use the Qubic Connect Snap?

### Step-by-Step Guide for End Users

1. **Install MetaMask**: Ensure you have the MetaMask extension installed in your browser.

2. **Connect to a Qubic DApp**: Visit a Qubic DApp that supports the Qubic Connect Snap. These DApps will prompt you to install and connect the Snap.

3. **Grant Permissions**: When prompted by MetaMask, grant the necessary permissions to the Qubic Connect Snap. This will allow the Snap to interact with the Qubic DApp.

4. **Use Qubic Features**: Once connected, you can use the features provided by the Qubic Connect Snap, such as deriving public keys and signing transactions, directly within the Qubic DApp.

## How can developers install the Qubic Connect Snap?

Install via NPM:

```bash
npm add @qubic-lib/qubic-mm-snap
```

## How do I start the Qubic Connect Snap?

1. Install the latest version of the Snaps CLI:

    ```bash
    pnpm setup
    pnpm add -g @metamask/snaps-cli
    ```

2. Install the dependencies:

    ```bash
    pnpm i
    ```

3. Build and start the local development server:

    ```bash
    pnpm start
    ```

## How do I use the Qubic Connect Snap?

The production snap is available as Snap ID `npm:@qubic-lib/qubic-mm-snap`.

The locally started snap is available as Snap ID `local:http://localhost:8081`.

### What RPC methods are available?

#### `getPublicId`

Returns the wallet's Qubic public key.

**Parameters:**

- `accountIdx` - The account index starting with 0.
- `confirm` - Whether to show a confirm dialog.

**Returns:**

Public ID.

**Example:**

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

#### `signTransaction`

Signs a transaction and returns the signature encoded as Base64.

**Parameters:**

- `base64Tx` - Transaction encoded as Base64.
- `offset` - Offset of the transaction in the message.
- `accountIdx` - Account index starting with 0.
- `confirm` - Boolean whether to show a confirm dialog.

**Returns:**

An object containing:

- `signedTx` - Transaction signature encoded as Base64.

**Example:**

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
