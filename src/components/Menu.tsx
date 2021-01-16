import React, { useState } from 'react';
import firebase from 'firebase/app';
import { useAppContextValue } from './AppContext';
import getClubName from '../getClubName';
import * as S from '../styles';

const Menu: React.FC = () => {
  const { user, data, version } = useAppContextValue();
  const [displaySyncTimestamp, setDisplaySyncTimestamp] = useState(true);

  return (
    <S.Menu>
      <div>
        <S.MenuLink to="/qr-reader">Les av QR-koder</S.MenuLink>
      </div>
      {user ? (
        <S.CardChooser>
          <section>
            <strong>Dine kort:</strong>
          </section>
          {data.cards?.map((card) => (
            <S.MenuLink key={card.id} to={`/cards/${card.id}`}>
              {getClubName(card.club)}
            </S.MenuLink>
          ))}
          {!data.cards && (
            <span>
              <em>Du har ingen kort</em>
            </span>
          )}
        </S.CardChooser>
      ) : (
        <div />
      )}

      <div>
        {user ? (
          <S.MenuLink
            to={'/logout'}
            onClick={(event) => {
              event.stopPropagation();
              Promise.all([caches?.delete('cards'), firebase.auth().signOut()]).catch(() => window.location.reload());
            }}>
            Logg ut
          </S.MenuLink>
        ) : (
          <S.MenuLink to={'/login'}>Logg inn</S.MenuLink>
        )}
        <div onClick={() => process.env.NODE_ENV === 'production' && setDisplaySyncTimestamp(!displaySyncTimestamp)}>
          {displaySyncTimestamp ? (
            <>
              <span>
                <em>Sist synkronisert:</em>
              </span>
              <span>
                <em>{data.syncTimestamp ? data.syncTimestamp.toLocaleString() : 'Aldri'}</em>
              </span>
            </>
          ) : (
            <>
              <span>
                <em>Versjon:</em>
              </span>
              <span>
                <em>{version}</em>
              </span>
            </>
          )}
        </div>
      </div>
    </S.Menu>
  );
};

export default Menu;
