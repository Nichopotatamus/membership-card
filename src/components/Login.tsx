import React, { useMemo, useRef, useState } from 'react';
import Button from './Button';
import firebase from 'firebase/app';
import getRealOrFakeEmail from '../getRealOrFakeEmail';
import { useHistory } from 'react-router-dom';
import { useAppContextValue } from './AppContext';
import * as S from '../styles';

const Login: React.FC = () => {
  const { setIsLoggingIn } = useAppContextValue();
  const history = useHistory();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoggingIn(true);
    setErrorCode(null);
    const username = usernameRef.current?.value!;
    const password = passwordRef.current?.value!;
    await firebase
      .auth()
      .signInWithEmailAndPassword(getRealOrFakeEmail(username), password)
      .then(() => history.push('/'))
      .catch((error) => {
        console.error(error);
        setErrorCode(error.code);
      });
    setIsLoggingIn(false);
  };

  const errorMessage = useMemo(() => {
    if (['auth/wrong-password', 'auth/invalid-email', 'auth/user-not-found'].includes(errorCode || '')) {
      return 'Feil brukernavn/e-post og/eller passord';
    } else if (errorCode) {
      return 'En ukjent feil har oppstått, vennligst prøv på nytt';
    }
  }, [errorCode]);

  return (
    <S.Login>
      <S.Form onSubmit={onSubmit}>
        <h1>Logg inn</h1>
        <S.FieldContainer>
          <S.Label>Brukernavn/e-post</S.Label>
          <input ref={usernameRef} type="text" placeholder="Brukernavn" name="username" />
        </S.FieldContainer>
        <S.FieldContainer>
          <S.Label>Passord</S.Label>
          <input ref={passwordRef} type="password" placeholder="Passord" name="password" />
        </S.FieldContainer>
        {errorCode && (
          <div>
            <S.FormError>{errorMessage}</S.FormError>
          </div>
        )}
        <div>
          <Button onClick={onSubmit} text="Logg inn" />
          <button style={{ display: 'none' }} type="submit" onClick={onSubmit} />
        </div>
      </S.Form>
      <S.Link to="/qr-reader">Les av QR-koder</S.Link>
    </S.Login>
  );
};

export default Login;
