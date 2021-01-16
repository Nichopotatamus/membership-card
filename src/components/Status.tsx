import React from 'react';
import messages from '../messages';
import * as S from '../styles';

type Props = {
  status?: string;
};

const Status: React.FC<Props> = ({ status }) => (
  <S.Status status={status}>{status ? messages[status] : 'Venter på kort'}</S.Status>
);

export default Status;
