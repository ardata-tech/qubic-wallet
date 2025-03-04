import styled from 'styled-components';

import { InputLabel } from './InputLabel';

type InputProps = {
  label: string;
  placeholder?: string;
  value: any;
  disabled: boolean;
  type: string;
  onChange: (value: string | number) => void;
  required?: boolean;
};

const Input = styled.input`
  width: 1419;
  height: 56;
  justify-content: space-between;
  border-radius: 6px;
  border-width: 1px;
  padding-top: 23px;
  padding-right: 19px;
  padding-bottom: 23px;
  padding-left: 19px;
  font-family: Inter-Reg;
`;

const LabelInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
`;

export const InputWithLabel = ({
  label,
  placeholder,
  value,
  disabled = false,
  type = 'text',
  onChange,
  required = false,
}: InputProps) => {
  return (
    <LabelInputContainer>
      <InputLabel style={{ fontFamily: 'Inter-Reg' }}>
        {label}
        <span style={{ color: 'red' }}>{required ? '*' : ''}</span>
      </InputLabel>
      <Input
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        // eslint-disable-next-line id-length
        onChange={(e) => onChange(e.target.value)}
      />
    </LabelInputContainer>
  );
};
