/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Qubic from '@ardata-tech/qubic-js';
import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import { ReactComponent as FlaskFox } from '../assets/metamask_fox_orange.svg';
import qubicLogo from '../assets/qubic-logo.png';
import qubicBg from '../assets/wall.png';
import {
  WalletDetailsSection,
  TransactionSection,
  QubicBorderedtButton,
  MetaMaskIndicatorButton,
  LoadingButton,
} from '../components';
import { defaultSnapOrigin } from '../config';
import {
  useMetaMask,
  useInvokeSnap,
  useMetaMaskContext,
  useRequestSnap,
} from '../hooks';
import { isLocalSnap, shouldDisplayReconnectButton } from '../utils';
import { toastErrorMessage, toastSuccessMessage } from '../utils/toast';
import usePolling from '../hooks/useQubicHealthPolling';
import './index.css';

const WalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-size: cover;
  background-position: center;
  repeat: no-repeat;
  padding: 10%;
  padding-top: 3%;

  @media (max-width: 425px) {
    width: 100% !important;
    padding: 20px !important;
  }
`;

const Header = styled.div`
  font-family: 'poppins-thin', sans-serif;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    width: 100% !important;
    margin-bottom: 10px;
  }
`;

const HeaderItemWrapper = styled.div`
  display: flex;
  flexdirection: row;
  height: 65px;
  alignitems: center;

  @media (max-width: 768px) {
    height: 40px;
  }
  @media (max-width: 425px) {
    height: 30px;
  }
`;

const QubicText = styled.span`
  font-size: 35px;
  font-weight: 500;
  letter-spacing: -7%;
  margin-left: 8px;
  font-family: Inter;

  @media (max-width: 768px) {
    font-size: 30px;
  }
  @media (max-width: 425px) {
    font-size: 20px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  justifycontent: flex-start;
  width: 100%;
  margin-top: 2rem;
`;

const TickContainer = styled.div`
  display: flex;
  gap: 8px;
  justifycontent: flex-start;
  width: 100%;
  font-family: Inter-Reg;
  margin-top: 20px;
  margin-bottom: 20px;

  @media (max-width: 425px) {
    margin-top: 15px;
    margin-bottom: 15px;
  }
`;

const Index = () => {
  const DEFAULT_TIME_LIMIT = 10;
  const { error } = useMetaMaskContext();
  const { isFlask, snapsDetected, installedSnap } = useMetaMask();
  const requestSnap = useRequestSnap();
  const invokeSnap = useInvokeSnap();

  const [tickValue, setTickValue] = useState(0);
  const [tickSeconds, setTickSeconds] = useState<number>(DEFAULT_TIME_LIMIT);
  const [balance, setBalance] = useState(0);
  const [toAddress, setToAddress] = useState('');
  const [amountToSend, setAmountToSend] = useState<number>();
  const [executionTick, setExecutionTick] = useState<number>(0);
  const [identity, setIdentity] = useState<any>();
  const [isTransactionProcessing, setIsTransactionProcessing] =
    useState<boolean>(false);

  const [metamaskState, setMetamaskState] = useState<
    'Connected' | 'Connecting' | 'Connect'
  >('Connect');

  const qubic = new Qubic({
    providerUrl: 'https://rpc.qubic.org',
    version: 1,
  });

  const res: any = usePolling(10000, 60000);

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? isFlask
    : snapsDetected;

  const connected = shouldDisplayReconnectButton(installedSnap);

  // useEffect(() => {
  //   if (connected && !identity) {
  //     getIdentity();
  //     fetchQubicLatestTick();
  //   }
  // }, [connected]);

  useEffect(() => {
    document.title = 'Qubic Connect';

    return () => {
      setBalance(0);
      setIdentity(undefined);
      setAmountToSend(undefined);
      setToAddress('');
    };
  }, []);

  useEffect(() => {
    if (connected && !identity) {
      getIdentity();
      fetchQubicLatestTick();
    } else if (connected && identity?.publicId) {
      fetchBalance();
      setMetamaskState('Connected');
    } else {
      setMetamaskState('Connect');
    }
  }, [connected, identity]);

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (res?.data) {
      if (tickSeconds === 0) {
        fetchQubicLatestTick();
        setTickSeconds(DEFAULT_TIME_LIMIT);
        return;
      }
      interval = setInterval(() => {
        setTickSeconds((prev) => prev - 1);
      }, 1000);
    }
    // eslint-disable-next-line consistent-return
    return () => clearInterval(interval);
  }, [tickSeconds, res]);

  const onConnect = async () => {
    if (!isFlask || !snapsDetected) {
      toastErrorMessage(
        !isFlask ? 'Please install MetaMask first' : 'Snap is not detected',
      );
      return;
    }
    if (metamaskState === 'Connect') {
      try {
        await requestSnap();
      } catch (error: any) {
        toastErrorMessage(`Error requesting Snap: ${error.message}`);
      } finally {
        setMetamaskState('Connecting');
      }
    }
  };

  const fetchBalance = async () => {
    try {
      if (identity?.publicId) {
        const { balance } = await qubic.identity.getBalanceByAddress(
          identity?.publicId,
        );
        setBalance(balance.balance);
      }
    } catch (error: any) {
      toastErrorMessage(`Fetch balance: ${error.message}`);
    }
  };

  const fetchQubicLatestTick = async () => {
    try {
      const latestTick = (await qubic.chain.getLatestTick()) ?? 0;
      if (isNaN(Number(latestTick))) {
        throw new Error('Invalid tick');
      }
      if (typeof latestTick === 'number' && latestTick > 0) {
        setTickValue(latestTick ?? 0);
        setExecutionTick(latestTick + 10);
      }
    } catch (error: any) {
      toastErrorMessage(`Fetch latest tick: ${error.message}`);
    }
  };

  const getIdentity = async () => {
    try {
      const jsonString: any = await invokeSnap({
        method: 'getPublicId',
      });

      if (typeof jsonString === 'string') {
        const privateKey = JSON.parse(jsonString)?.privateKey;
        if (privateKey) {
          const privateKeyBase26 = qubic.utils.hexToBase26(privateKey);
          const identity = await qubic.identity.createIdentity(
            privateKeyBase26,
          );
          setIdentity(identity);
        }
      }
    } catch (error: any) {
      setBalance(0);
      toastErrorMessage(`Get Identity: ${error.message}`);
    }
  };

  const validateTransaction = () => {
    setIsTransactionProcessing(true);

    const amount = amountToSend ?? 0;
    const fromAddress: string = identity?.publicId;
    const inValidAddressLength =
      fromAddress?.length != 60 && toAddress?.length != 60;
    const inValidBalance = amount > balance || balance == 0 || amount == 0;

    if (
      [inValidAddressLength, inValidBalance].every((value) => value === false)
    ) {
      sendTransaction();
    } else {
      setIsTransactionProcessing(false);
      toastErrorMessage('Invalid Transaction');
    }
  };

  const sendTransaction = async () => {
    const amount = amountToSend ?? 0;
    try {
      const transactionData = await qubic.transaction.createTransaction(
        identity.publicId,
        toAddress,
        amount,
        executionTick,
      );
      const signedTransaction = await qubic.transaction.signTransaction(
        transactionData,
        identity.privateKey,
      );
      const signedTransactionBase64 = btoa(
        String.fromCharCode(...signedTransaction),
      );
      const result = await qubic.transaction.broadcastTransaction(
        signedTransactionBase64,
      );
      if (result) {
        setIsTransactionProcessing(false);
        onReset();
        toastSuccessMessage(`Sent ${amountToSend} QUBIC to ${toAddress}`);
        setTimeout(fetchBalance, 10000);
      }
    } catch (error: any) {
      setIsTransactionProcessing(false);
      toastErrorMessage(`Failed to send ${amountToSend} QUBIC to ${toAddress}`);
    }
  };

  const disabledWalletDetails =
    !identity || Number.isNaN(balance) || balance == 0;

  const onReset = () => {
    setToAddress('');
    setAmountToSend(0);
  };

  return (
    <div
      className="wallet-container"
      style={{ backgroundImage: `url(${qubicBg})` }}
    >
      <header className="header">
        <div className="header-item-wrapper">
          <img className="qubic-logo" src={qubicLogo} alt="logo" />
          <span className="qubic-text">qubic</span>
          <span
            className="qubic-text qubic-text-connect"
            style={{
              color: '#61f0fe',
            }}
          >
            connect
          </span>
        </div>
        <div>
          <MetaMaskIndicatorButton
            onClick={onConnect}
            disabled={metamaskState == 'Connected'}
          >
            <div className="metamask-button-container">
              <div className="metamask-button-container-img">
                <FlaskFox />
              </div>
              <span>{`${metamaskState} to MetaMask`}</span>
            </div>
          </MetaMaskIndicatorButton>
        </div>
      </header>
      <WalletDetailsSection
        disabled={true}
        address={isMetaMaskReady && identity ? identity.publicId : undefined}
        balance={balance || undefined}
        tick={
          isMetaMaskReady && identity
            ? `${tickValue} (${tickSeconds}s)`
            : undefined
        }
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
        tickValue={executionTick}
      />

      <ButtonContainer>
        <div>
          <QubicBorderedtButton
            disabled={!amountToSend && !toAddress}
            onClick={onReset}
          >
            Reset
          </QubicBorderedtButton>
        </div>
        <div>
          <LoadingButton
            disabled={!toAddress || !amountToSend}
            loading={isTransactionProcessing}
            onClick={validateTransaction}
          >
            {isTransactionProcessing ? 'Sending' : 'Send'}
          </LoadingButton>
        </div>
      </ButtonContainer>
      <ToastContainer />
    </div>
  );
};

export default Index;
