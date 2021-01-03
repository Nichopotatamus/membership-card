import React from 'react';
import styled from 'styled-components/macro';
import { kinkRed } from '../stylingVariables';

type Props = {
  size: number;
  active?: boolean;
  onClick?: any;
};

const StyledHamburger = styled.div<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 2px;
  margin-right: -2px;
`;

const Hamburger: React.FC<Props> = ({ size, active, onClick }) => (
  <StyledHamburger size={size} onClick={onClick}>
    <svg viewBox="-5 0 10 8" width={size * 0.8}>
      <line y2="8" stroke={active ? kinkRed : 'white'} strokeWidth="10" strokeDasharray="2 1" />
    </svg>
  </StyledHamburger>
);

export default Hamburger;
