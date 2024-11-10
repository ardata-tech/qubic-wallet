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
pnpm setup
pnpm add -g @metamask/snaps-cli
```

Install the dependencies

```bash
pnpm i
```

Build and start the local development server

```bash
pnpm start
```

## Using the snap

The production snap is available as Snap ID `npm:@qubic-lib/qubic-mm-snap`.

The locally started snap is available as Snap ID `local:http://localhost:8081`.

See the [RPC API](./RPC.md) for more information on how to interact with the snap.


## Publish
publish with.

```bash
npm run build
npm publish --access public
```

## LICENSE
All Qubic Software is licensed unter the Anti Military License: https://github.com/qubic-network/license
