import React from 'react';
import styled from 'styled-components/macro';
import messages from "../messages";

type Props = {
  status?: string;
};

const StyledStatus = styled.div<{ status?: string }>`
  background-color: ${(props) => (props.status ? (props.status === 'isValid' ? 'green' : 'red') : 'yellow')};
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: black;
  font-size: 24px;
`;

const Status: React.FC<Props> = ({ status }) => <StyledStatus status={status}>{status ? messages[status] : 'Venter på kort'}</StyledStatus>;

export default Status;
