/* eslint-disable prettier/prettier */
import { InputWithLabel } from './Input';
import { SectionContainer } from './SectionContainer';
import { SectionTitle } from './SectionTitle';
import React from 'react';

type IWalletDetailsSection = {
  address: string | undefined;
  balance: number | undefined;
  tick: string | undefined;
  disabled: boolean;
};

const noBorderStyle = {
  border: 'none',
  padding: 0,
  marginTop: '1rem',
  backgroundColor: 'transparent',
};

export const WalletDetailsSection = ({
  address,
  balance,
  tick,
  disabled = false,
}: IWalletDetailsSection) => {
  return (
    <SectionContainer >
      <SectionTitle style={{ fontFamily: 'Poppins-Reg', fontWeight: 600 }}>
        Wallet Details
      </SectionTitle>
      <InputWithLabel
        style={noBorderStyle}
        showLabel={true}
        onChange={() => {}}
        required={false}
        type="text"
        disabled={disabled}
        label="Address ID"
        value={ address || '-'}
      />
      <InputWithLabel
        style={noBorderStyle}
        showLabel={true}
        onChange={() => {}}
        type={typeof balance === 'number' ? 'number' : 'text'}
        disabled={disabled}
        label="Balance"
        value={balance ||  '-'}
      />
      <InputWithLabel
        style={noBorderStyle}
        showLabel={true}
        onChange={() => {}}
        type="text"
        disabled={disabled}
        label="Current Tick"
        value={tick || '-'}
      />
    </SectionContainer>
  );
};
