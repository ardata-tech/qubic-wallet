import styled from 'styled-components';

export const QubicSendButton = styled.button`
  /* Base styles */
  border: none;
  height: 55px;
  min-width: 130px;
  font-size: 19px;
  font-weight: 600;
  line-height: 22.29px;
  letter-spacing: -2%;
  background-color: #ccfcff; /* Light cyan background matching the image */
  color: #111927;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0px 2px 24px rgba(0, 0, 0, 0.16); /* Add subtle shadow to match the image */

  /* Hover state */
  &:hover {
    background-color: #333333 !important;
    color: white;
  }

  /* Disabled state */
  &:disabled {
    background: rgb(216, 220, 220);
    color: black;
    &:hover {
      background: rgb(216, 220, 220) !important;
      color: black;
    }
  }

  /* Responsive styles */
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
  /* Base styles */
  background-color: white;
  border: 1px solid #111927 !important; /* Add border to match the image */
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

  /* Hover state */
  &:hover {
    background-color: #333333 !important;
    color: white;
    border-color: #333333 !important;
  }

  /* Disabled state */
  &:disabled {
    background: rgb(216, 220, 220);
    color: black;
    &:hover {
      background: rgb(216, 220, 220) !important;
      color: black;
    }
  }

  /* Responsive styles */
  @media (max-width: 425px) {
    height: 35px;
    min-width: 100px;
    font-size: 14px;
    line-height: 14.29px;
  }
`