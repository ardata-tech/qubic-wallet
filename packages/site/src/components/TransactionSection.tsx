import type { ComponentProps } from 'react';
import styled from 'styled-components';
import { SectionContainer } from './SectionContainer';
import { SectionTitle } from './SectionTitle';
import { InputWithLabel } from './Input'

type ITransactionSection = {
  disabled:boolean
  destinationValue: string;
  amountValue:number
  tickValue:number
};


export const TransactionSection = ({
  destinationValue,
  amountValue,
  tickValue,
  disabled=false
}: ITransactionSection) => {
  return (
    <SectionContainer>
      <SectionTitle>Send Qubic</SectionTitle>
      <InputWithLabel
        type="text"
        disabled={disabled}
        label="Destination Details"
        value={destinationValue}
      />
      <InputWithLabel
        type="number"
        disabled={disabled}
        label="Amount"
        value={amountValue}
      />
      <InputWithLabel
        type="number"
        disabled={disabled}
        label="Execution Tick"
        value={tickValue}
      />
    </SectionContainer>
  );
};