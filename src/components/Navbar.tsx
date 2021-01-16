import React from 'react';
import Hamburger from './Hamburger';
import { useAppContextValue } from './AppContext';
import Spinner from './Spinner';
import * as S from '../styles';

const Navbar: React.FC = () => {
  const { isMenuActive, setIsMenuActive } = useAppContextValue();
  return (
    <S.Navbar onClick={() => setIsMenuActive(!isMenuActive)}>
      <S.HamburgerWrapper>
        <Hamburger size={60} active={isMenuActive} />
      </S.HamburgerWrapper>
      <S.NavbarTitle>Skog & Mark</S.NavbarTitle>
      <S.SpinnerWrapper>
        <Spinner />
      </S.SpinnerWrapper>
    </S.Navbar>
  );
};

export default Navbar;
