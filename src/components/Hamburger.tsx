import React from 'react';
import { kinkRed } from '../stylingVariables';
import * as S from '../styles';

type Props = {
  size: number;
  active?: boolean;
  onClick?: any;
};

const Hamburger: React.FC<Props> = ({ size, active, onClick }) => (
  <S.Hamburger size={size} onClick={onClick}>
    <svg viewBox="-5 0 10 8" width={size * 0.8}>
      <line y2="8" stroke={active ? kinkRed : 'white'} strokeWidth="10" strokeDasharray="2 1" />
    </svg>
  </S.Hamburger>
);

export default Hamburger;
