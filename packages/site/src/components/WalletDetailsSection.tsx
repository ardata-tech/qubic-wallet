import type { ComponentProps } from 'react';
import styled from 'styled-components';
import { SectionContainer } from './SectionContainer';
import { SectionTitle } from './SectionTitle';
import { InputWithLabel } from './Input'

type IWalletDetailsSection = {
  address: string;
  balance: number;
  disabled:boolean
};


export const WalletDetailsSection = ({ address, balance, disabled=false }: IWalletDetailsSection) => {
  return (
    <SectionContainer>
      <SectionTitle>Wallet Details</SectionTitle>
      <InputWithLabel type='text' disabled={disabled} label="Address ID" value={address} />
      <InputWithLabel type="number"disabled={disabled} label="Balance" value={balance} />
    </SectionContainer>
  );
};