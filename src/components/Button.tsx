import React from 'react';
import * as S from '../styles';

type Props = {
  url?: string;
  text: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
};

const Button: React.FC<Props> = ({ url, text, onClick }) =>
  url && url.startsWith('/') ? (
    <S.Button to={url} onClick={onClick}>
      {text}
    </S.Button>
  ) : (
    <S.ExternalLinkButton href={url} onClick={onClick}>
      {text}
    </S.ExternalLinkButton>
  );

export default Button;
