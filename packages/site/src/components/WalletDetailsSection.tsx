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
      <SectionTitle style={{ fontFamily: 'Poppins-Reg', fontWeight: 600 }}>
        Wallet Details
      </SectionTitle>
      <InputWithLabel
        onChange={() => {}}
        required={false}
        type="text"
        disabled={disabled}
        label="Address ID"
        value={address}
      />
      <InputWithLabel
        onChange={() => {}}
        type="number"
        disabled={disabled}
        label="Balance"
        value={balance}
      />
    </SectionContainer>
  );
};