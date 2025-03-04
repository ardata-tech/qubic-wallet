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
  showLabel?: boolean;
  style?: any
};

const Input = styled.input`
  font-family: Inter-Reg;
  width: 100%;
  height: 18px;
  border-radius: 6px;
  border-width: 1px;
  padding-top: 23px;
  padding-right: 19px;
  padding-bottom: 23px;
  padding-left: 19px;

  @media (max-width: 425px) {
    padding-top: 12px;
    padding-right: 12px;
    padding-bottom: 12px;
    padding-left: 12px;
    width: 90%;
  }
`;

const LabelInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
  
`;

export const InputWithLabel = ({
  showLabel=true,
  label,
  placeholder,
  value,
  disabled = false,
  type = 'text',
  onChange,
  required = false,
  style
}: InputProps) => {
  return (
    <LabelInputContainer>

      {showLabel && (
        <InputLabel style={{ fontFamily: 'Inter-Reg' }}>
          {label}
          <span style={{ color: 'red' }}>{required ? '*' : ''}</span>
        </InputLabel>
      )}

      <Input
        style={style}
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
