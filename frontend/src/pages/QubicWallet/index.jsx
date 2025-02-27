import VerticalStack from "../../component/VertialStack";
import HorizontalStack from "../../component/HorizontalStack";
import qubicLogo from "../../assets/img/qubic-logo.png";
import Button from "../../component/Button";
import Input from "../../component/Input";
import "./index.scss";

const QubicWallet = () => {
  const search = (formData) => {
    const query = formData.get("query");
    alert(`You searched for '${query}'`);
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
            <span className="tick-section__tick">Tick:</span>
            <span className="tick-section__value">20,144,178</span>
            <span className="tick-section__second">(125s)</span>
          </HorizontalStack>
        </div>
        <form action={search}>
          <div className="qubic-wallet__header-divider">Wallet Details</div>

          <VerticalStack>
            <div className="input-label">
              <VerticalStack>
                <label className="input-label__label">Address ID</label>
                <input className="qubic-wallet__input" name="addressID" />
              </VerticalStack>
            </div>

            <div className="input-label">
              <VerticalStack>
                <label className="input-label__label">Balance</label>
                <input className="qubic-wallet__input" name="balance" />
              </VerticalStack>
            </div>
          </VerticalStack>

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
                />
              </VerticalStack>
            </div>

            <div className="input-label">
              <VerticalStack>
                <label className="input-label__label">Amount</label>
                <input className="qubic-wallet__input" name="sendAmount" />
              </VerticalStack>
            </div>

            <div className="input-label">
              <VerticalStack>
                <label className="input-label__label">Execution Tick</label>
                <input className="qubic-wallet__input" name="sendAmount" />
              </VerticalStack>
            </div>
          </VerticalStack>

          <HorizontalStack className="horizontal-stack-button-container">
            <Button type="bordered" caption={"Reset"} />
            <Button caption={"Send"} />
          </HorizontalStack>
        </form>
      </div>
    </div>
  );
};

export default QubicWallet;
