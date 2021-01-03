import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { kinkRed, kinkRedDarker, kinkRedDarkest } from '../stylingVariables';

const style = `
  padding: 10px;
  color: white;
  border: none;
  background-color: ${kinkRed};
  cursor: pointer;
  text-decoration: none;

  :hover {
    background-color: ${kinkRedDarker};
  }

  :active {
    background-color: ${kinkRedDarkest};
  }
`;

const StyledLink = styled(Link)`
  ${style}
`;

const StyledExternalLink = styled.a`
  ${style}
`;

type Props = {
  url?: string;
  text: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
};

const Button: React.FC<Props> = ({ url, text, onClick }) =>
  url && url.startsWith('/') ? (
    <StyledLink to={url} onClick={onClick}>
      {text}
    </StyledLink>
  ) : (
    <StyledExternalLink href={url} onClick={onClick}>
      {text}
    </StyledExternalLink>
  );

export default Button;
