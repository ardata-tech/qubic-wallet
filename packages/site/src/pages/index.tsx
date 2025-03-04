/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Qubic from '@ardata-tech/qubic-js';
import { useEffect, useState, type ComponentProps } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import styled from 'styled-components';

import { ReactComponent as FlaskFox } from '../assets/flask_fox.svg';
import qubicLogo from '../assets/qubic-logo.png';
import qubicBg from '../assets/wall.png';
import {
  WalletDetailsSection,
  TransactionSection,
  QubicBorderedtButton,
  QubicSendButton,
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
import NetworkSection from '../components/NetworkSection';

const WalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-size: cover;
  background-position: center;
  repeat: no-repeat;
  height: 100vh;
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
  margin-bottom: 0px;

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
  font-size: 45px;
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
  justifyContent: flex-start;
  width: 100%;
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

const toastOption: any = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
};

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
  const [fromAddress, setFromAddress] = useState();
  const [amountToSend, setAmountToSend] = useState<number>(0);
  const [executionTick, setExecutionTick] = useState<number>(0);
  const [identity, setIdentity] = useState<any>();
  const [isTransactionProcessing, setIsTransactionProcessing] =
    useState<boolean>(false);

  const qubic = new Qubic({
    providerUrl: 'https://rpc.qubic.org',
    version: 1,
  });

  const toastSuccessMessage = (message: string) => toast(message, toastOption);
  
  const toastErrorMessage = (message: string) =>
    toast.error(message, toastOption);

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? isFlask
    : snapsDetected;

  useEffect(() => {
    if (tickSeconds === 0) {
      setTickSeconds(DEFAULT_TIME_LIMIT);
      return;
    }
    const interval = setInterval(() => {
      setTickSeconds((prev) => prev - 1);
    }, 1000);
    // eslint-disable-next-line consistent-return
    return () => clearInterval(interval);
  }, [tickSeconds]);

  useEffect(() => {
    if (tickSeconds === 0) {
      fetchQubicLatestTick();
    }
  }, [tickSeconds]);

  useEffect(() => {
    console.log('isMetaMaskReady', isMetaMaskReady);
    if (isMetaMaskReady && !identity) {
      getIdentity();
      if (tickValue === 0) {
        fetchQubicLatestTick();
      }
    }
  }, [isMetaMaskReady]);

  useEffect(() => {
    if (identity?.publicId) {
      fetchBalance();
    }
  }, [identity]);

  const fetchBalance = async () => {
    try {
      if (identity?.publicId) {
        const { balance } = await qubic.identity.getBalanceByAddress(
          identity?.publicId,
        );
        setBalance(balance.balance);
      }
    } catch (error: any) {
      toastErrorMessage(error.message);
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
        setExecutionTick(latestTick);
      }
    } catch (error: any) {
      toastErrorMessage(error.message);
    }
  };

  const getIdentity = async () => {
    try {
      const jsonString: string | unknown = await invokeSnap({
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
      toastErrorMessage(error.message);
    }
  };

  const validateTransaction = () => {
    setIsTransactionProcessing(true);
    const fromAddress: string = identity.publicId;
    const inValidAddressLength =
      !fromAddress ||
      fromAddress.length < 60 ||
      !identity?.publicId ||
      identity.publicId.length < 60;
    const inValidBalance =
      amountToSend > balance || balance == 0 || amountToSend == 0;
    if (!inValidAddressLength || !inValidBalance) {
      setIsTransactionProcessing(false);
      toastErrorMessage('Invalid Transaction');
    } else {
      sendTransaction();
    }
  };

  const sendTransaction = async () => {
    try {
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
      const result = await qubic.transaction.broadcastTransaction(
        signedTransactionBase64,
      );
      if (result) {
        onReset();
        toastSuccessMessage(
          `Successfully sent ${amountToSend} QUBIC to ${toAddress}`,
        );
        setTimeout(fetchBalance, 10000);
      }
    } catch (error: any) {
      setIsTransactionProcessing(false);
      toastErrorMessage(`Failed to send ${amountToSend} QUBIC to ${toAddress}`);
    }
  };

  const disabledWalletDetails =
    !identity ||
    Number.isNaN(balance) ||
    balance === 0 ||
    Number(balance) < Number(amountToSend);

  const onReset = () => {
    setToAddress('');
    setAmountToSend(0);
  };

  return (
    <WalletContainer style={{ backgroundImage: `url(${qubicBg})` }}>
      <Header>
        <HeaderItemWrapper>
          <img src={qubicLogo} alt="logo" />
          <QubicText style={{ fontFamily: 'Poppins-Reg', fontWeight: 600 }}>
            qubic
          </QubicText>
          <QubicText
            style={{
              fontFamily: 'Poppins-Reg',
              fontWeight: 600,
              color: '#61f0fe',
            }}
          >
            connect
          </QubicText>
        </HeaderItemWrapper>
        <div>
          <QubicSendButton onClick={requestSnap}>
            <FlaskFox /> Connect
          </QubicSendButton>
        </div>
      </Header>
      <WalletDetailsSection
        disabled={true}
        address={identity?.publicId}
        balance={balance}
      />

      <NetworkSection>
        <TickContainer>
          Tick:
          <span style={{ fontWeight: 'bold', color: '#11192766' }}>
            {tickValue}
            <span style={{ color: '#BE7676' }}>({tickSeconds}s)</span>
          </span>
        </TickContainer>
      </NetworkSection>

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
          <QubicBorderedtButton onClick={onReset}>Reset</QubicBorderedtButton>
        </div>
        <div>
          <LoadingButton
            loading={isTransactionProcessing}
            onClick={validateTransaction}
          >
            Sending
          </LoadingButton>
        </div>
      </ButtonContainer>
      <ToastContainer />
    </WalletContainer>
  );
};

export default Index;
