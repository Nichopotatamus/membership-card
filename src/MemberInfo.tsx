import React from 'react';
import styled from 'styled-components/macro';
import {MemberData} from "./types";

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
    <div>{memberData.cardNumber}</div>
    <div>{memberData.name}</div>
    <div>{memberData.expiry}</div>
    <div>{memberData.club}</div>
  </StyledInfo>
);

export default MemberInfo;
