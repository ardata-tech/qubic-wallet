import { useState, useEffect, useRef } from "react";
import VerticalStack from "../../component/VertialStack";
import HorizontalStack from "../../component/HorizontalStack";
import qubicLogo from "../../assets/img/qubic-logo.png";
import Button from "../../component/Button";
import Modal from "../../component/Modal";
import Qubic from "@ardata-tech/qubic-js";
import "./index.scss";

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
  //const [snapId, setSnapId] = useState();

  const snapId = `local:${window.location.href}`;
  const qubic = new Qubic({
    providerUrl: "https://rpc.qubic.org",
    version: 1,
  });

  useEffect(() => {
    connect()
  }, []);

  useEffect(() => {
    if (connected) {
      getPubId();
      getTickData();
    }
  }, [connected]);

  const getTickData = async () => {
    const latestTick = await qubic.chain.getLatestTick();
    if (
      Number(latestTick) == NaN ||
      latestTick == undefined ||
      latestTick == null
    ) {
      throw new Error("Invalid tick");
    }
    setTickValue(latestTick);
    setExecutionTick(latestTick + 10);
  };

  const processTransaction = async () => {
    setLockSendTransaction(true);
    //todo:
    //perform validation
    const hasFromAddress = fromAddress && fromAddress.length > 0;
    const hasEnoughBalance = balance && balance > 0 && balance >= amountToSend;
    const isAmountValid =
      amountToSend && Number.isInteger(amountToSend) && amountToSend > 0;
    const hasToAddress = toAddress && toAddress.length > 0 && toAddress !== fromAddress;

    if (
      !hasFromAddress ||
      !hasEnoughBalance ||
      !isAmountValid ||
      !hasToAddress
    ) {
      setLockSendTransaction(false);
      alert(`Invalid Transaction, please fill in all required fields`);
      return;
    }

    //get latest tick
    await getTickData();

    const params = {
      accountIdx: 0,
      confirm: true,
      to: toAddress,
      amount: amountToSend,
      tick: executionTick + 10,
    };

    //signed transaction
    const encodedTransaction = await window.ethereum.request({
      method: "wallet_invokeSnap",
      params: {
        snapId,
        request: {
          method: "createTransactionAndSign",
          params,
        },
      },
    });

    //call qubic js broadcast transaction
    qubic.transaction
      .broadcastTransaction(encodedTransaction)
      .then((result) => {
        alert(JSON.stringify(result));
        setTimeout(async () => {
          await getBalance(fromAddress);
          setLockSendTransaction(false);
        }, 5000);
      })
      .catch((err) => {
        console.log("err", err.message);
        alert(err.message);
      });
  };

  const connect = async () => {
    //setConnected(true);
    try {
      await window.ethereum.request({
        method: "wallet_requestSnaps",
        params: { [snapId]: {} },
      });
      setConnected(true);
    } catch (error) {
      console.log("connect error: ", error);
      setConnected(false);
    }
  };

  const getBalance = async (fromAddress) => {
    try {
      const balance = await qubic.identity.getBalanceByAddress(fromAddress);
      setBalance(balance.balance.balance);
    } catch (err) {
      console.error(err);
      alert("Problem happened: " + err.message || err);
    }
  };

  async function getPubId() {
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

      //call getBalance
      await getBalance(publicId);
    } catch (err) {
      console.error(err);
      alert("Problem happened: " + err.message || err);
    }
  }

  const reset = () => {
    setToAddress("");
    setAmountToSend("");
  };


  return (
    <div className="qubic-wallet">
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
            {tickValue > 0 && <span className="tick-section__tick">Tick:</span>}

            {tickValue > 0 && (
              <span className="tick-section__value">{tickValue}</span>
            )}
            {tickSeconds > 0 && (
              <span className="tick-section__second">({tickSeconds})</span>
            )}
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

        {balance > 0 && (
          <>
            <div className="qubic-wallet__header-divider">Send Qubic</div>

            <VerticalStack>
              <div className="input-label">
                <VerticalStack>
                  <label className="input-label__label">
                    Destination Address
                  </label>
                  <input
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
                type="bordered"
                caption={"Reset"}
                onClick={() => reset()}
              />
              <Button
                disabled={lockSendTransaction}
                caption={"Send"}
                onClick={() => processTransaction()}
              />
            </HorizontalStack>
          </>
        )}
      </div>
    </div>
  );
};

export default QubicWallet;
