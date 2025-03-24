/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Qubic from '@ardata-tech/qubic-js';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ReactComponent } from '../assets/metamask_fox_orange.svg';
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

interface IBroadcastTransactionResponse {
  peersBroadcasted: number;
  encodedTransaction: string;
  transactionId: string;
}

interface Identity {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
  publicId: string;
}

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
  const [identity, setIdentity] = useState<Identity>();
  const [isTransactionProcessing, setIsTransactionProcessing] =
    useState<boolean>(false);

  const [metamaskState, setMetamaskState] = useState<
    'Connected' | 'Connecting' | 'Connect'
  >('Connect');

  const qubic = new Qubic({
    providerUrl: 'https://rpc.qubic.org',
    version: 1,
  });

  const healtStatus = usePolling(10000, 60000);

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? isFlask
    : snapsDetected;

  const connected = shouldDisplayReconnectButton(installedSnap);

  const fetchBalance = async () => {
    try {
      if (identity?.publicId) {
        const { balance } = await qubic.identity.getBalanceByAddress(
          identity?.publicId,
        );
        setBalance(balance.balance);
      }
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        toastErrorMessage(`Fetch balance: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    document.title = 'Qubic Connect';

    return () => {
      setBalance(0);
      setIdentity(undefined);
      setAmountToSend(undefined);
      setToAddress('');
    };
  }, []);

  const fetchQubicLatestTick = async () => {
    try {
      const latestTick = (await qubic.chain.getLatestTick()) ?? 0;
      if (isNaN(Number(latestTick))) {
        throw new Error('Invalid tick');
      }
      if (typeof latestTick === 'number' && latestTick > 0) {
        setTickValue(latestTick ?? 0);
        setExecutionTick(latestTick + 30);
      }
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        toastErrorMessage(`Fetch latest tick: ${error.message}`);
      }
    }
  };

  const getIdentity = async () => {
    try {
      const jsonString: unknown = await invokeSnap({
        method: 'getPublicId',
      });

      if (typeof jsonString === 'string') {
        const qubicId: Identity = JSON.parse(jsonString);

        if (qubicId.publicKey && qubicId.publicId) {
          const newIdentity: Identity = {
            publicKey: qubicId.publicKey,
            privateKey: new Uint8Array(32), // Uint8Array of 0. Refactor code to expect all operations with private key to be done in snap
            publicId: qubicId.publicId
          };

          setIdentity(newIdentity);
        } else {
          throw new Error('Invalid Qubic ID');
        }
      }
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        setBalance(0);
        toastErrorMessage(`Get Identity: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    if (connected && !identity) {
      setMetamaskState('Connect');
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
    if (healtStatus?.data) {
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
  }, [tickSeconds, healtStatus]);

  const onConnect = async () => {
    if (!isFlask || !snapsDetected) {
      toastErrorMessage(
        !isFlask ? 'Please install MetaMask first' : 'Snap is not detected',
      );
      return;
    }
    if (metamaskState === 'Connect') {
      try {
        setMetamaskState('Connecting');
        if (!connected) {
          await requestSnap();
        }

        await getIdentity();
      } catch (error: Error | unknown) {
        if (error instanceof Error) {
          toastErrorMessage(`Error requesting Snap: ${error?.message}`);
        }
      } finally {
        if (!connected || !identity?.publicId) {
          setMetamaskState('Connect');
        }
      }
    }
  };

  const onReset = () => {
    setToAddress('');
    setAmountToSend(0);
  };

  const sendTransaction = async () => {
    const amount = amountToSend ?? 0;
    try {

      if (!identity?.publicId) {
        return 
      }

      const jsonString: unknown = await invokeSnap({
        method: 'signTransaction',
        params: { 
          publicid: identity?.publicId,
          toAddress,
          amount,
          executionTick
        }, 
      });

      if (typeof jsonString === 'string') {
        const parsedResult = JSON.parse(jsonString);
        if (parsedResult.result.peersBroadcasted) {
          const { transactionId }: IBroadcastTransactionResponse = parsedResult.result;

          setIsTransactionProcessing(false);
          onReset();
          toastSuccessMessage(`Sent ${amountToSend} QUBIC to ${toAddress}`);
          toastSuccessMessage(`Transaction ID: ${transactionId}`);
          setTimeout(fetchBalance, 10000);
        } else {
          throw new Error('Unexpected response format');
        }
      }
      else {
        throw new Error('Invalid JSON response');
      }
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        setIsTransactionProcessing(false);
        toastErrorMessage(
          `Failed to send ${amountToSend} QUBIC to ${toAddress}`,
        );
      }
    }
  };

  const validateTransaction = async () => {
    if (!identity) {
      return;
    }

    setIsTransactionProcessing(true);
    const amount = amountToSend ?? 0;
    const fromAddress: string = identity?.publicId;
    // const inValidAddressLength =
    //   fromAddress?.length != 60 && toAddress?.length != 60;
    // const inValidBalance = amount > balance || balance == 0 || amount == 0;

    const isFromAddressValid = await qubic.identity.verifyIdentity(fromAddress)
    const isToAddressValid = await qubic.identity.verifyIdentity(toAddress)
    const isAmountValid = amount >= 0 && amount <= balance
    
    if (
    //  [inValidAddressLength, inValidBalance].every((value) => value === false)
      isFromAddressValid && isToAddressValid && isAmountValid
    ) {
      sendTransaction();
    } else {
      setIsTransactionProcessing(false);
      toastErrorMessage('Invalid Transaction. Please check your inputs.');
    }
  };

  const disabledWalletDetails =
    !identity || Number.isNaN(balance) || balance == 0;

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
                <ReactComponent />
              </div>
              <span>{`${metamaskState} to MetaMask`}</span>
            </div>
          </MetaMaskIndicatorButton>
        </div>
      </header>
      <WalletDetailsSection
        disabled={true}
        address={isMetaMaskReady && identity ? identity.publicId : undefined}
        balance={isMetaMaskReady && identity ? balance : undefined}
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
        tickValue={disabledWalletDetails ? 0 : executionTick}
      />

      <div className="action-button-container">
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
      </div>
      <ToastContainer />
    </div>
  );
};

export default Index;
