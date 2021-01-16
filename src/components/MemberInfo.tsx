import React from 'react';
import { MemberData } from '../types';
import getClubName from '../getClubName';
import * as S from '../styles';

type Props = {
  memberData: MemberData;
};

const MemberInfo: React.FC<Props> = ({ memberData }) => (
  <S.Info>
    <div>{memberData.memberId}</div>
    <div>{memberData.alias}</div>
    <div>{memberData.expiry}</div>
    <div>{getClubName(memberData.club)}</div>
  </S.Info>
);

export default MemberInfo;
