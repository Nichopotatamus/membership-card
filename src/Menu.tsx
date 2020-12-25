import React from 'react';
import firebase from 'firebase/app';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { useAppContextValue } from './AppContext';
import getClubName from './getClubName';

type Props = {};

const StyledMenu = styled.div`
  flex: 1;
  background-color: black;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  & div {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }
  & div:nth-child(1) {
    flex-grow: 1;
  }
  & div:nth-child(2) {
    flex-grow: 3;
  }
  & div:nth-child(3) {
    flex-grow: 1;
  }
`;

const StyledCardChooser = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledLink = styled(Link)`
  color: white;
`;

const Menu: React.FC<Props> = () => {
  const { user, data } = useAppContextValue();

  return (
    <StyledMenu>
      <div>
        <StyledLink to="/qr-reader">Les av QR-koder</StyledLink>
      </div>
      {user ? (
        <StyledCardChooser>
          <section>
            <strong>Velg kort:</strong>
          </section>
          {data.cards?.map((card) => (
            <StyledLink key={card.id} to={`/cards/${card.id}`}>
              {getClubName(card.club)}
            </StyledLink>
          ))}
        </StyledCardChooser>
      ) : (
        <div />
      )}

      <div>
        {user ? (
          <StyledLink
            to={'/logout'}
            onClick={(event) => {
              event.stopPropagation();
              firebase
                .auth()
                .signOut()
                .catch(() => window.location.reload());
            }}>
            Logg ut
          </StyledLink>
        ) : (
          <StyledLink to={'/login'}>Logg inn</StyledLink>
        )}
        <div>
          <span>
            <em>Sist synkronisert:</em>
          </span>
          <span>
            <em>{data.syncTimestamp ? data.syncTimestamp.toLocaleString() : 'Aldri'}</em>
          </span>
        </div>
      </div>
    </StyledMenu>
  );
};

export default Menu;
