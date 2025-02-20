import React, { useState } from 'react';
import { snap } from '@metamask/snaps-sdk';

const App = () => {
  const [host, setHost] = useState('');
  const [pubkey, setPubkey] = useState('');

  const handleGetPublicKey = async () => {
    // Call the renderGetPublicKey function from your ui.js
    const response = await snap.request({
      method: 'qubic_connect_get_public_key',
      params: { host }
    });
    setPubkey(response.pubkey);
  };

  const handleSignTransaction = async () => {
    const message = "Your transaction message here"; // Replace with actual message
    await snap.request({
      method: 'qubic_connect_sign_transaction',
      params: { host, message }
    });
  };

  return (
    <div>
      <h1>Qubic Connect</h1>
      <input
        type="text"
        placeholder="Enter Host"
        value={host}
        onChange={(e) => setHost(e.target.value)}
      />
      <button onClick={handleGetPublicKey}>Get Public Key</button>
      {pubkey && <p>Your Public Key: {pubkey}</p>}
      <button onClick={handleSignTransaction}>Sign Transaction</button>
    </div>
  );
};

export default App;
