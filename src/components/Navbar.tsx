import React from 'react';
import Hamburger from './Hamburger';
import styled from 'styled-components/macro';
import { useAppContextValue } from './AppContext';
import Spinner from './Spinner';

type Props = {};

const StyledNavbar = styled.div`
  background-color: black;
  height: 60px;
  width: 100%;
  display: flex;
  color: white;
  align-items: center;
  border-bottom: 2px solid #222222;
`;

const StyledHamburgerWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;

const StyledSpinnerWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const StyledNavbarTitle = styled.div`
  user-select: none;
  width: 100%;
  display: flex;
  justify-content: center;
  font-weight: bolder;
  font-size: 24px;
`;

const Navbar: React.FC<Props> = () => {
  const { isMenuActive, setIsMenuActive } = useAppContextValue();
  return (
    <StyledNavbar onClick={() => setIsMenuActive(!isMenuActive)}>
      <StyledHamburgerWrapper>
        <Hamburger size={60} active={isMenuActive} />
      </StyledHamburgerWrapper>
      <StyledNavbarTitle>Skog & Mark</StyledNavbarTitle>
      <StyledSpinnerWrapper>
        <Spinner />
      </StyledSpinnerWrapper>
    </StyledNavbar>
  );
};

export default Navbar;
