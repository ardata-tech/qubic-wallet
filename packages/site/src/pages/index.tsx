/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Qubic from '@ardata-tech/qubic-js';
import { useEffect, useState, type ComponentProps } from 'react';
import styled from 'styled-components';

import { ReactComponent as FlaskFox } from '../assets/flask_fox.svg';
import {
  WalletDetailsSection,
  TransactionSection,
  QubicBorderedtButton,
  QubicSendButton,
} from '../components';
import { defaultSnapOrigin } from '../config';
import {
  useMetaMask,
  useInvokeSnap,
  useMetaMaskContext,
  useRequestSnap,
} from '../hooks';
import { isLocalSnap, shouldDisplayReconnectButton } from '../utils';

const WalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-position: center;
  repeat: no-repeat;
  height: 100vh;
`;

const Header = styled.header`
  font-family: 'poppins-thin', sans-serif;
  display: flex;
  width: 80%;
  height: 75px;
  top: 150px;
  left: 155px;
  justify-content: space-between;
  margin-bottom: 25px;
`;

const QubicText = styled.span`
  font-family: 'poppins-thin', sans-serif;
  font-size: 50px;
  font-weight: 500;
  letter-spacing: -7%;
  margin-left: 8px;
  font-family: Inter;
`;

const TickContainer = styled.div`
  display: 'flex',
  gap: '8px',
  justifyContent: 'flex-start',
  width: '80%',
  marginBottom: '16px',`;

const Index = () => {
  const { error } = useMetaMaskContext();
  const { isFlask, snapsDetected, installedSnap } = useMetaMask();
  const requestSnap = useRequestSnap();
  const invokeSnap = useInvokeSnap();

  const [tickValue, setTickValue] = useState(0);
  const [tickSeconds, setTickSeconds] = useState();
  const [balance, setBalance] = useState(0);
  const [toAddress, setToAddress] = useState('');
  const [fromAddress, setFromAddress] = useState();
  const [amountToSend, setAmountToSend] = useState<number>(0);
  const [executionTick, setExecutionTick] = useState<number>(0);
  const [identity, setIdentity] = useState<any>();

  const qubic = new Qubic({
    providerUrl: 'https://rpc.qubic.org',
    version: 1,
  });

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? isFlask
    : snapsDetected;

  useEffect(() => {
    console.log('isMetaMaskReady', isMetaMaskReady);
    if (isMetaMaskReady && !identity) {
      getIdentity();
      fetchQubicLatestTick();
      fetchBalance();
    }
  }, [isMetaMaskReady]);

  useEffect(() => {
    if (identity) {
      fetchQubicLatestTick();
      fetchBalance();
    }
  }, [identity]);

  const fetchBalance = async () => {
    try {
      const { balance } = await qubic.identity.getBalanceByAddress(
        identity?.publicId);
        setBalance(balance.balance);
      } catch (error:any) {
        console.log(`Problem happened: ${error.message || error}`);
      }
    };

  const fetchQubicLatestTick = async () => {
    const latestTick = (await qubic.chain.getLatestTick()) ?? 0;
    if (isNaN(Number(latestTick))) {
      throw new Error('Invalid tick');
    }
    if (typeof latestTick === 'number' && latestTick > 0) {
      setTickValue(latestTick ?? 0);
      setExecutionTick(latestTick + 10);
    }
  };

  const getIdentity = async () => {
    const jsonString: any = await invokeSnap({ method: 'getPublicId' });
    if (jsonString) {
      const privateKey = JSON.parse(jsonString)?.privateKey;
      const privateKeyBase26 = qubic.utils.hexToBase26(privateKey);
      const identity = await qubic.identity.createIdentity(privateKeyBase26);
      setIdentity(identity);
    }
  };

  const sendTransaction = async () => {
    await fetchQubicLatestTick();

    console.log(
      'payload',
      identity?.publicId,
      toAddress,
      amountToSend,
      executionTick,
    );

    const transactionData = await qubic.transaction.createTransaction(
      identity.publicId,
      toAddress,
      amountToSend,
      executionTick,
    );

    const signedTransaction = await qubic.transaction.signTransaction(
      transactionData,
      identity.privateKey,
    );

    const signedTransactionBase64 = btoa(
      String.fromCharCode(...signedTransaction),
    );

    console.log('signedTransactionBase64', signedTransactionBase64);

    // const result = await qubic.transaction.broadcastTransaction(
    //   signedTransactionBase64,
    // );

    // console.log('broadcastTransaction result', result);
    await fetchBalance();
  };

  const disabledWalletDetails =
    !identity||
    Number.isNaN(balance) ||
    balance === 0 ||
    Number(balance) < Number(amountToSend);
  
  const onReset = () => {
    setToAddress('');
    setAmountToSend(0);
  };

  return (
    <WalletContainer style={{ backgroundImage: `url(wall.png)` }}>
      <Header>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            height: '75px',
            alignItems: 'center',
          }}
        >
          <img src={'qubic-logo.png'} alt="logo" />
          <QubicText style={{ fontFamily: 'Poppins-Reg', fontWeight: 600 }}>
            qubic
          </QubicText>
          <QubicText style={{ fontFamily: 'Poppins-Reg', fontWeight: 600 }}>
            connect
          </QubicText>
        </div>
        <div>
          <QubicSendButton onClick={requestSnap}>
            <FlaskFox /> Connect
          </QubicSendButton>
        </div>
      </Header>
      <WalletDetailsSection
        disabled={disabledWalletDetails}
        address={identity?.publicId}
        balance={balance}
      />

      <TransactionSection
        onChangeDestinationValue={(value) => setToAddress(String(value))}
        onChangeAmountValue={(value) => {
          setAmountToSend(Number(value));
        }}
        onTickValueValue={(value) => setExecutionTick(Number(value))}
        disabled={disabledWalletDetails}
        amountValue={amountToSend}
        destinationValue={toAddress}
        tickValue={executionTick + 10}
      />

      <div
        style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'flex-start',
          width: '80%',
          marginBottom: '16px',
          fontFamily: 'Inter-Reg',
        }}
      >
        Latest Tick: <span style={{ fontWeight: 'bold' }}> {tickValue}</span>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'flex-start',
          width: '80%',
        }}
      >
        <div>
          <QubicBorderedtButton onClick={onReset}>Reset</QubicBorderedtButton>
        </div>
        <div>
          <QubicSendButton
            disabled={disabledWalletDetails}
            onClick={sendTransaction}
          >
            Send
          </QubicSendButton>
        </div>
      </div>
    </WalletContainer>
  );
};

export default Index;
