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
  overflow: hidden;
`;

const StyledQrImage = styled.img`
  width: 100%;
  height: 100%;
`;

const StyledNoCardMessage = styled.div`
  flex: 1;
  display: grid;
  place-items: center;
  color: white;
  font-size: 24px;
  padding: 10px;
`;

const StyledContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%; /* 1:1 Aspect Ratio */
`;

const StyledImageContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

const Card: React.FC<Props> = ({ cardId }) => {
  const { data } = useAppContextValue();
  const card = data.cards?.find((card) => card.id === cardId);
  if (!card) {
    return <StyledNoCardMessage>Inget medlemskort er valgt</StyledNoCardMessage>;
  }
  return (
    <StyledCard>
      <StyledContainer>
        <StyledImageContainer>
          <StyledQrImage src={card.qr} alt="QR code" />
        </StyledImageContainer>
      </StyledContainer>
      <MemberInfo memberData={card} />
    </StyledCard>
  );
};

export default Card;
