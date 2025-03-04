import type { ComponentProps } from 'react';
import styled from 'styled-components';
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
      <SectionTitle style={{ fontFamily: 'Inter-Reg', fontWeight: 'bold' }}>
        Send Qubic
      </SectionTitle>
      <InputWithLabel
        type="text"
        disabled={disabled}
        label="Destination Details"
        value={destinationValue}
        onChange={onChangeDestinationValue}
      />
      <InputWithLabel
        type="number"
        disabled={disabled}
        label="Amount"
        value={amountValue}
        onChange={(e) => onChangeAmountValue(e)}
      />
      <InputWithLabel
        type="number"
        disabled={disabled}
        label="Execution Tick"
        value={tickValue}
        onChange={(e) => onTickValueValue(e)}
      />
    </SectionContainer>
  );
};