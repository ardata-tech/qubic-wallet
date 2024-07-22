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

export function renderSignTransaction(host, message) {
  return snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading('Sign transaction'),
        text(host),
        divider(),
        copyable(message)
      ])
    }
  });
}
