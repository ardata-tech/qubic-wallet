import styled from 'styled-components';

export const QubicSendButton = styled.button`
  border: none;
  height: 55px;
  min-width: 130px;
  font-size: 19px;
  font-weight: 600;
  line-height: 22.29px;
  letter-spacing: -2%;
  background-color: #ccfcff;
  color: #111927;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;

  :disabled {
    border: none !important;
    background: rgb(216, 220, 220);
    color: black;
    &:hover {
      background: rgb(216, 220, 220);
      color: black;
    }
  }

  &:hover {
    border-color: none;
    background-color: rgb(174, 200, 202) !important;
  }
  @media (max-width: 425px) {
    height: 35px;
    min-width: 100px;
    font-size: 14px;
    line-height: 14.29px;
  }
`;

export const MetaMaskIndicatorButton = styled.button`
  border: 1px solid #ff5c16 !important;
  background-color: white;
  color: #ff5c16;
  font-weight: 450;
  border-radius: 50px;
  min-width: 230px;

  &:hover {
    :disabled {
      background: #ff5c16;
    }

    color: white;
    border-color: #ff5c16 !important;
    background-color: rgb(249, 106, 45) !important;
  }
`;

interface LoadingButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  loading?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
}

export const LoadingButton = ({
  onClick,
  loading = false,
  children,
  disabled,
}: LoadingButtonProps) => {
  return (
    <QubicSendButton disabled={loading || disabled} onClick={onClick}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {loading ? <div className="spinner" /> : null}
        <div>{children}</div>
      </div>
    </QubicSendButton>
  );
};

export const QubicBorderedtButton = styled.button`
  border: none !important;
  height: 55px;
  min-width: 127px;
  font-size: 19px;
  font-weight: 600;
  line-height: 22.29px;
  letter-spacing: -2%;
  color: #111927;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgb(174, 200, 202) !important;
  }

  background-color: white;
  :disabled {
    background: rgb(216, 220, 220);
    color: black;
    &:hover {
      background: rgb(216, 220, 220);
      color: black;
    }
  }

  @media (max-width: 425px) {
    height: 35px;
    min-width: 100px;
    font-size: 14px;
    line-height: 14.29px;
  }
`;
