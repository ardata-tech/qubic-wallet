import { SectionContainer } from './SectionContainer';
import { SectionTitle } from './SectionTitle';
import { InputWithLabel } from './Input'

type ITransactionSection = {
  disabled: boolean;
  destinationValue: string;
  amountValue: number;
  tickValue: number;
  onChangeDestinationValue: (value: string | number) => void;
  onChangeAmountValue: (value: string | number) => void;
  onTickValueValue: (value: string|number) => void;
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
        Send Qubic
      </SectionTitle>
      <InputWithLabel
        required
        type="text"
        disabled={disabled}
        label="Destination Details"
        value={destinationValue}
        onChange={onChangeDestinationValue}
      />
      <InputWithLabel
        required
        type="number"
        disabled={disabled}
        label="Amount"
        value={amountValue}
        onChange={(e) => onChangeAmountValue(e)}
      />
      <InputWithLabel
        required
        type="number"
        disabled={disabled}
        label="Execution Tick"
        value={tickValue}
        onChange={(e) => onTickValueValue(e)}
      />
    </SectionContainer>
  );
};