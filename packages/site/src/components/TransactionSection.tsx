/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { SectionContainer } from './SectionContainer';
import { SectionTitle } from './SectionTitle';
import { InputWithLabel } from './Input';

type ITransactionSection = {
  disabled: boolean;
  destinationValue: string;
  amountValue: number;
  tickValue: number;
  onChangeDestinationValue: (value: string | number) => void;
  onChangeAmountValue: (value: string | number) => void;
  onTickValueValue: (value: string | number) => void;
};

export const TransactionSection = ({
  destinationValue,
  amountValue,
  tickValue,
  disabled = false,
  onChangeDestinationValue,
  onChangeAmountValue,
  onTickValueValue,
}: ITransactionSection) => {
  return (
    <SectionContainer>
      <SectionTitle style={{ fontFamily: 'Poppins-Reg', fontWeight: 600 }}>
        Send Qubic Units (QUBIC)
      </SectionTitle>
      <InputWithLabel
        required
        type="text"
        disabled={disabled}
        label="Address ID of the Receiver"
        value={destinationValue}
        onChange={onChangeDestinationValue}
        placeholder="e.g., ECRXFGMYUXWETCOUKCRIQDNCEOJAHUXFTQETBZSDVCLEMKPZZMJLVOECGHRB"
      />
      <InputWithLabel
        required
        type="number"
        disabled={disabled}
        label="Amount in Qubic Units (QUBIC)"
        value={amountValue}
        // eslint-disable-next-line id-length
        onChange={(e) => onChangeAmountValue(e)}
      />
      <InputWithLabel
        required
        type="number"
        disabled={disabled}
        label="Execution Tick"
        value={tickValue}
        // eslint-disable-next-line id-length
        onChange={(e) => onTickValueValue(e)}
      />
    </SectionContainer>
  );
};
