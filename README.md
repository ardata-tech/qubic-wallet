# Qubic Connect

Qubic Connect is a MetaMask Snap that provides Qubic capabilities such as public key derivation, transaction signing, and broadcasting. It integrates with MetaMask to enable secure and seamless interactions with the Qubic blockchain.

## Prerequisites
- MetaMask Flask installed
- A text editor (for example, VS Code)
- Node version 20.11 or later
- Yarn

## Getting Started

From the root of the project, install the project dependencies using Yarn:

```shell
yarn install
```

You may get a warning like the following:

```shell
@lavamoat/allow-scripts has detected dependencies without configuration. explicit configuration required.
run "allow-scripts auto" to automatically populate the configuration.
```

You can fix this by running the following command:

```shell
yarn allow-scripts auto
```

Start the development server:

```shell
yarn start
```

You are now serving the Snap at http://localhost:8080 and its front-end dapp at http://localhost:8000.
