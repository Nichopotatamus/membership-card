import React, { useMemo, useRef, useState } from 'react';
import Button from './Button';
import firebase from 'firebase/app';
import getRealOrFakeEmail from '../getRealOrFakeEmail';
import { useHistory } from 'react-router-dom';
import qs from 'qs';
import * as S from '../styles';

const SignUp: React.FC = () => {
  const history = useHistory();
  const { email, token } = useMemo(
    () => qs.parse(history.location.search, { ignoreQueryPrefix: true }) as { [key: string]: string },
    [history.location.search]
  );
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const onSubmit = async () => {
    setErrorCode(null);
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    const confirmPassword = passwordRef.current?.value;
    if (username && password) {
      if (password !== confirmPassword) {
        setErrorCode('signup/passwords-must-be-equal');
        return;
      }
      await fetch(`${process.env.REACT_APP_CLOUD_FUNCTIONS_HOST}/api/signup`, {
        method: 'POST',
        body: JSON.stringify({ username, password, token }),
        headers: { 'content-type': 'application/json' },
      })
        .then(async (response) => {
          if (response.status === 200) {
            await firebase
              .auth()
              .signInWithEmailAndPassword(getRealOrFakeEmail(username), password)
              .then(() => history.push('/'));
          } else {
            const error = await response.json();
            console.error(error);
            setErrorCode(error.code || 'unknown');
            // TODO Better error handling
          }
        })
        .catch((error) => {
          console.error(error);
          setErrorCode('unknown');
        });
    }
  };

  const errorMessage = useMemo(() => {
    if (errorCode === 'signup/invalid-token') {
      return 'Ugyldig token, kontakt kartotekfører for å få ny lenke til registrering';
    } else if (errorCode === 'signup/email-already-in-use') {
      return 'E-post-adressen er allerede i bruk';
    } else if (errorCode === 'signup/username-already-in-use') {
      return 'Brukernavnet er allerede i bruk';
    } else if (errorCode === 'signup/passwords-must-be-equal') {
      return 'Passordene må være like';
    } else if (errorCode) {
      return 'En ukjent feil har oppstått, vennligst prøv på nytt';
    }
  }, [errorCode]);

  return (
    <S.SignUp>
      <S.Form onSubmit={onSubmit}>
        <h1>Registrer ny bruker</h1>
        <S.FieldContainer>
          <S.Label>Brukernavn</S.Label>
          <input ref={usernameRef} defaultValue={email} type="text" placeholder="Brukernavn" name="username" />
        </S.FieldContainer>
        <S.FieldContainer>
          <S.Label>Passord</S.Label>
          <input ref={passwordRef} type="password" placeholder="Passord" name="password" />
        </S.FieldContainer>
        <S.FieldContainer>
          <S.Label>Bekreft passord</S.Label>
          <input ref={confirmPasswordRef} type="password" placeholder="Bekreft passord" name="confirm-password" />
        </S.FieldContainer>
        {errorCode && (
          <div>
            <S.FormError>{errorMessage}</S.FormError>
          </div>
        )}
        <div>
          <Button onClick={onSubmit} text="Registrer" />
          <button style={{ display: 'none' }} type="submit" onClick={onSubmit} />
        </div>
      </S.Form>
    </S.SignUp>
  );
};

export default SignUp;
