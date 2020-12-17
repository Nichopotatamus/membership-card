import React, { useMemo } from 'react';
import firebase from 'firebase';
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
  const { isLoggedIn, data } = useAppContextValue();

  const syncText = useMemo(() => {
    if (data.syncTimestamp) {
      const date = new Date(data.syncTimestamp);
      const split = date.toISOString().split('T');
      return `${split[0]} ${split[1].split('.')[0]}`;
    }
    return 'Aldri';
  }, [data.syncTimestamp]);

  return (
    <StyledMenu>
      <div>
        <StyledLink to="/qr-reader">Les av QR-koder</StyledLink>
      </div>
      {isLoggedIn ? (
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
        {isLoggedIn ? (
          <StyledLink
            to={'/logout'}
            onClick={() => {
              firebase
                .auth()
                .signOut()
                .then(() => {
                  window.location.reload();
                })
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
            <em>{syncText}</em>
          </span>
        </div>
      </div>
    </StyledMenu>
  );
};

export default Menu;
