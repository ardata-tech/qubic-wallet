import { useState, useEffect, useRef } from "react";
import VerticalStack from "../../component/VertialStack";
import HorizontalStack from "../../component/HorizontalStack";
import qubicLogo from "../../assets/img/qubic-logo.png";
import Button from "../../component/Button";
import Qubic from "@ardata-tech/qubic-js";
import "./index.scss";
import { ToastContainer, toast } from "react-toastify";

const QubicWallet = () => {
  const [tickValue, setTickValue] = useState(0);
  const [tickSeconds, setTickSeconds] = useState();
  const [balance, setBalance] = useState(0);
  const [toAddress, setToAddress] = useState();
  const [fromAddress, setFromAddress] = useState();
  const [amountToSend, setAmountToSend] = useState();
  const [executionTick, setExecutionTick] = useState();
  const [connected, setConnected] = useState(false);
  const [lockSendTransaction, setLockSendTransaction] = useState(false);

  const snapId = `local:${window.location.href}`;
  const qubic = new Qubic({
    providerUrl: "https://rpc.qubic.org",
    version: 1,
  });

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    if (connected) {
      fetchMetamaskPublicId();
      fetchQubicLatestTick();
    }
  }, [connected]);

  const connect = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_requestSnaps",
        params: { [snapId]: {} },
      });
      setConnected(true);
    } catch (error) {
      console.log("connect error: ", error);
      notifyError(error.message);
      setConnected(false);
    }
  };

  const notify = (message) =>
    toast(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const notifyError = (message) =>
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const disabledWalletDetails =
    !connected || !fromAddress || Number.isNaN(balance) || balance == 0 || Number(balance) < Number(amountToSend);

  const fetchQubicLatestTick = async () => {
    const latestTick = await qubic.chain.getLatestTick();
    if (isNaN(Number(latestTick))) {
      throw new Error("Invalid tick");
    }
    setTickValue(latestTick);
    setExecutionTick(Number(latestTick) + 10);
  };

  const hasValidTransactionDetails = () => {
    const hasValidFromAddress = fromAddress && fromAddress.length > 0;
    const hasValidToAddress = toAddress && toAddress.length > 0 && toAddress !== fromAddress;
    const isAmountValid = Number.isInteger(amountToSend) && amountToSend > 0;
    const hasSufficientBalance = balance >= amountToSend;
    return hasValidFromAddress && hasValidToAddress && isAmountValid && hasSufficientBalance;
  };

  const handleSendTransaction = async () => {
    setLockSendTransaction(true);

    if (!hasValidTransactionDetails()) {
      notifyError("Invalid Transaction, please fill in all required fields");
      setLockSendTransaction(false);
      return;
    }

    try {
      await fetchQubicLatestTick();
      const txParams = {
        accountIdx: 0,
        confirm: true,
        to: toAddress,
        amount: amountToSend,
        tick: executionTick + 10,
      };
      const encodedTransaction = await window.ethereum.request({
        method: "wallet_invokeSnap",
        params: {
          snapId,
          request: { method: "createTransactionAndSign", params: txParams },
        },
      });
      await broadcastRpcTransaction(encodedTransaction);
    } finally {
      setLockSendTransaction(false);
    }
  };

  const broadcastRpcTransaction = async (encodedTransaction) => {
    try {
      const result = await qubic.transaction.broadcastTransaction(encodedTransaction);
      setTimeout(async () => {
        await fetchBalance(fromAddress);
        setLockSendTransaction(false);
      }, 5000);
    } catch (error) {
      console.error(error);
      notifyError(error.message);
    }
  };

  const fetchBalance = async (address) => {
    try {
      const { balance } = await qubic.identity.getBalanceByAddress(address);
      console.log("balance", balance);
      setBalance(balance.balance);
    } catch (error) {
      notifyError(`Problem happened: ${error.message || error}`);
    }
  };

  const fetchMetamaskPublicId = async () => {
    try {
      const publicId = await window.ethereum.request({
        method: "wallet_invokeSnap",
        params: {
          snapId,
          request: {
            method: "getPublicId",
            params: {
              accountIdx: 0,
              confirm: true,
            },
          },
        },
      });
      setFromAddress(publicId);
      fetchBalance(publicId);
    } catch (error) {
      console.error("Error fetching public ID:", error);
      notifyError(`An error occurred: ${error.message || error}`);
    }
  };

  const resetForm = () => {
    setToAddress("");
    setAmountToSend(0);
  };

  return (
    <div className="qubic-wallet">
      <ToastContainer />

      <div style={{ width: "50%" }}>
        <div
          style={{
            width: "100%",
            height: "75px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <HorizontalStack>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "8px",
              }}
            >
              <img
                src={qubicLogo}
                alt="qubic-logo"
                className="qubic-wallet__qubic-logo"
              />
            </div>
            <div className="qubic-wallet__qubic-log-label">qubic</div>
            <div className="qubic-wallet__qubic-log-label-connect">connect</div>
          </HorizontalStack>

          <HorizontalStack className={"tick-section"}>
            <span className="tick-section__tick">Tick:</span>
            <span className="tick-section__value">{tickValue || ""}</span>
            <span className="tick-section__second">
              {tickSeconds ? `(${tickSeconds})` : ""}
            </span>
          </HorizontalStack>
        </div>
        <div className="qubic-wallet__header-divider">Wallet Details</div>

        <VerticalStack>
          <div className="input-label">
            <VerticalStack>
              <label className="input-label__label">Address ID</label>
              <input
                disabled
                className="qubic-wallet__input"
                name="addressID"
                value={fromAddress}
              />
            </VerticalStack>
          </div>

          <div className="input-label">
            <VerticalStack>
              <label className="input-label__label">Balance</label>
              <input
                className="qubic-wallet__input"
                name="balance"
                disabled
                value={balance}
              />
            </VerticalStack>
          </div>
        </VerticalStack>

        <div className="qubic-wallet__header-divider">Send Qubic</div>

        <VerticalStack>
          <div className="input-label">
            <VerticalStack>
              <label className="input-label__label">Destination Address</label>
              <input
                disabled={disabledWalletDetails}
                className="qubic-wallet__input"
                name="destinationAddress"
                placeholder="to Address"
                onChange={(e) => setToAddress(e.target.value)}
              />
            </VerticalStack>
          </div>

          <div className="input-label">
            <VerticalStack>
              <label className="input-label__label">Amount</label>
              <input
                disabled={disabledWalletDetails}
                className="qubic-wallet__input"
                name="sendAmount"
                type="number"
                onChange={(e) => setAmountToSend(Number(e.target.value))}
              />
            </VerticalStack>
          </div>

          <div className="input-label">
            <VerticalStack>
              <label className="input-label__label">Execution Tick</label>
              <input
                disabled={disabledWalletDetails}
                className="qubic-wallet__input"
                name="executionTick"
                value={executionTick}
                placeholder=""
                type="number"
                onChange={(e) => {
                  if (lockSendTransaction) {
                    setLockSendTransaction(false);
                  }
                  setExecutionTick(Number(e.target.value));
                }}
              />
            </VerticalStack>
          </div>
        </VerticalStack>

        <HorizontalStack className="horizontal-stack-button-container">
          <Button
            disabled={disabledWalletDetails}
            type="bordered"
            caption={"Reset"}
            onClick={() => resetForm()}
          />
          <Button
            disabled={lockSendTransaction || disabledWalletDetails}
            caption={"Send"}
            onClick={() => handleSendTransaction()}
          />
        </HorizontalStack>
      </div>
    </div>
  );
};

export default QubicWallet;
