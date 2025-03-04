/* eslint-disable prettier/prettier */
import { InputWithLabel } from './Input';
import { SectionContainer } from './SectionContainer';
import { SectionTitle } from './SectionTitle';

type IWalletDetailsSection = {
  address: string;
  balance: number;
  tick: string;
  disabled: boolean;
};

export const WalletDetailsSection = ({
  address,
  balance,
  tick,
  disabled = false,
}: IWalletDetailsSection) => {
  return (
    <SectionContainer>
      <SectionTitle style={{ fontFamily: 'Poppins-Reg', fontWeight: 600 }}>
        Wallet Details
      </SectionTitle>
      <InputWithLabel
        style={{
          border: 'none',
          padding: 0,
          marginTop: '1rem',
          backgroundColor: 'transparent',
        }}
        showLabel={true}
        onChange={() => {}}
        required={false}
        type="text"
        disabled={disabled}
        label="Address ID"
        value={address}
      />
      <InputWithLabel
        style={{
          border: 'none',
          padding: 0,
          marginTop: '1rem',
          backgroundColor: 'transparent',
        }}
        showLabel={true}
        onChange={() => {}}
        type="number"
        disabled={disabled}
        label="Balance in Qubic Units (QUBIC)"
        value={balance}
      />
      <InputWithLabel
        style={{
          border: 'none',
          padding: 0,
          marginTop: '1rem',
          backgroundColor: 'transparent',
        }}
        showLabel={true}
        onChange={() => {}}
        type="text"
        disabled={disabled}
        label="Tick"
        value={tick}
      />
    </SectionContainer>
  );
};
