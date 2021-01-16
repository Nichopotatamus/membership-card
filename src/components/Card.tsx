import React from 'react';
import MemberInfo from './MemberInfo';
import { useAppContextValue } from './AppContext';
import * as S from '../styles';

type Props = {
  cardId: string;
};

const Card: React.FC<Props> = ({ cardId }) => {
  const { data, isFetchingData, isLoggingIn } = useAppContextValue();
  const card = data.cards?.find((card) => card.id === cardId);
  if (!data.cards && isLoggingIn) {
    return <S.Message>Laster bruker...</S.Message>;
  } else if (!data.cards && isFetchingData) {
    return <S.Message>Laster kort...</S.Message>;
  } else if (!card) {
    return <S.Message>Inget medlemskort er valgt</S.Message>;
  }
  return (
    <S.Card>
      <S.Container>
        <S.ImageContainer>
          <S.QrImage src={card.qr} alt="QR code" />
        </S.ImageContainer>
      </S.Container>
      <MemberInfo memberData={card} />
    </S.Card>
  );
};

export default Card;
