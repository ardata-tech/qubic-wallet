// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ComponentProps } from 'react';
import styled from 'styled-components';

export const SectionTitle = styled.div`
  font-weight: 600;
  letter-spacing: -2%;
  font-size: 20px;
  line-height: 24.2px;
  margin-bottom: 25px;

  @media (max-width: 425px) {
    font-size: 18px;
    line-height: 18.2px;
    margin-bottom: 20px;
  }
`;
