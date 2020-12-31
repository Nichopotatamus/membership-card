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
  width: 100vw;
  height: 100vw;
`;

const StyledNoCardMessage = styled.div`
  flex: 1;
  display: grid;
  place-items: center;
  color: white;
  font-size: 24px;
  padding: 10px;
`;

const Card: React.FC<Props> = ({ cardId }) => {
  const { data } = useAppContextValue();
  const card = data.cards?.find((card) => card.id === cardId);
  if (!card) {
    return <StyledNoCardMessage>Inget medlemskort er valgt</StyledNoCardMessage>;
  }
  return (
    <StyledCard>
      <StyledQrImage src={card.qr} alt="QR code" />
      <MemberInfo memberData={card} />
    </StyledCard>
  );
};

export default Card;
