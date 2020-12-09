import React from 'react';
import styled from 'styled-components/macro';
import MemberInfo from './MemberInfo';
import { useAppContextValue } from './AppContext';

type Props = {
  cardId: string;
};

const StyledCard = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: scroll;
`;

const StyledQrImage = styled.img`
  width: ${window.innerWidth}px;
  height: ${window.innerWidth}px;
`;

const Card: React.FC<Props> = ({ cardId }) => {
  const { data } = useAppContextValue();
  const card = data.cards?.find((card) => card.id === cardId);
  if (!card) {
    return null;
  }
  return (
    <StyledCard>
      <StyledQrImage src={card.qr} alt="QR code" />
      <MemberInfo memberData={card} />
    </StyledCard>
  );
};

export default Card;
