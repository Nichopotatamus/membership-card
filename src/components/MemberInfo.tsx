import React from 'react';
import styled from 'styled-components/macro';
import {MemberData} from "../types";
import getClubName from "../getClubName";

type Props = {
  memberData: MemberData;
};

const StyledInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  flex-grow: 100;
  font-size: 24px;
  color: white;
`;

const MemberInfo: React.FC<Props> = ({ memberData }) => (
  <StyledInfo>
    <div>{memberData.memberId}</div>
    <div>{memberData.alias}</div>
    <div>{memberData.expiry}</div>
    <div>{getClubName(memberData.club)}</div>
  </StyledInfo>
);

export default MemberInfo;
