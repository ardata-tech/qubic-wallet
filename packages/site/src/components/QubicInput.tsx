import styled from 'styled-components';

const InputContainer = styled.div`
  position: relative;
`;

type InputProps = {
  label?: string;
  title?: string;
  disabled?: boolean;
  fullWidth?: boolean;
};

const Label = styled.label<InputProps>`
  font-family: Inter-Thin;
  font-weight: 600;
  font-size: 15px;
  line-height: 18.15px;
  letter-spacing: -2%;
  color: #1119279e;
`;

const Input = styled.input<InputProps>`
  padding: 10px 30px 10px 10px;
  width: 100%;
  transition: all 0.3s ease;
  border: 1px solid #11192780;
  border-radius: 6px;
  height: 56px;
  font-size: 17px;
  color: #11192766;
  font-weight: 400;
  line-height: 20.57px;
`;

export const QubicInput = () => {
  return (
    <InputContainer>
      <Label className="input-label__label">Destination Address</Label>
      <Input />
    </InputContainer>
  );
};
