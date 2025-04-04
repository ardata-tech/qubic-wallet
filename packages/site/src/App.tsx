/* eslint-disable import/no-unassigned-import */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FunctionComponent, ReactNode } from 'react';
import styled from 'styled-components';
import { GlobalStyle } from './config/theme';
import './app.css';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  max-width: 100vw;
`;

export type AppProps = {
  children: ReactNode;
};

export const App: FunctionComponent<AppProps> = ({ children }) => {
  return (
    <>
      <GlobalStyle />
      <Wrapper>{children}</Wrapper>
    </>
  );
};
