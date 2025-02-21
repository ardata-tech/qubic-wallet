# Qubic Connect

Qubic Connect is a MetaMask extension that has Qubic capabilities such as public key derivation and transaction signing.

## Usage
Install via NPM.

```bash
npm add @qubic-lib/qubic-mm-snap
```

## Starting the snap

Install the latest version of the Snaps CLI

```bash
npm install -g @metamask/snaps-cli
```

Install the dependencies

```bash
npm i
```

Build and start the local development server

```bash
npm start
```

## Using the snap

The locally started snap is available as Snap ID `local:http://localhost:8081`.

See the [RPC API](./docs/RPC.md) for more information on how to interact with the snap.


## Publish
You can see the package on [https://www.npmjs.com/package/@qubic-lib/qubic-mm-snap](https://www.npmjs.com/package/@qubic-lib/qubic-mm-snap).

publish with.

```bash
npm run build
npm publish --access public
```
