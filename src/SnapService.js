import { panel, heading, text, copyable, divider } from "@metamask/snaps-sdk"

export function renderGetPublicKey(host, pubkey) {
  return snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading('Your public Qubic ID'),
        text(host),
        divider(),
        text(pubkey)
      ])
    }
  });
}

export function generateTransaction(host, transactionData) {
  const toAddresss = transactionData.to
  const fromAddresss = transactionData.from;
  const amount = transactionData.amount;
  
  return snap.request({
    method: "snap_dialog",
    params: {
      type: "confirmation",
      content: panel([
        heading("Generate Transaction"),
        text(`TO: ${toAddresss}`),
        text(`FROM: ${fromAddresss}`),
        text(`AMOUNT: ${amount}`),
        divider(),
      ]),
    },
  });
}

export function renderSendTransaction(host) {
  return snap.request({
    method: "snap_dialog",
    params: {
      type: "confirmation",
      content: panel([
        heading("Send Transaction"),
        text(host),
        divider(),
        // copyable(message)
      ]),
    },
  });
}

export function renderSignTransaction(host) {
  return snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading('Sign transaction'),
        text(host),
        divider(),
        // copyable(message)
      ])
    }
  });
}
