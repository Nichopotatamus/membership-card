import React, { useMemo, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import Button from './Button';
import { gray1, gray3, kinkRed } from '../stylingVariables';
import firebase from 'firebase/app';
import getRealOrFakeEmail from '../getRealOrFakeEmail';
import { Link, useHistory } from 'react-router-dom';
import { useAppContextValue } from './AppContext';

const StyledLogin = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 32px;

  input::placeholder {
    color: ${gray1};
  }

  input {
    border: 2px solid ${gray3};
    border-radius: 0;
    color: white;
    background-color: ${gray3};
    font-size: 15px;
    height: 40px;
    padding-left: 8px;
  }

  input:nth-child(2) {
    margin-bottom: 5px;
  }

  input:nth-child(3) {
    margin-bottom: 16px;
  }

  input:focus {
    border: 2px solid ${kinkRed};
    outline: none;
  }

  h1 {
    color: ${kinkRed};
    font-size: 2em;
    margin-bottom: 16px;
  }

  a {
    display: inline-block;
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const StyledLabel = styled.label`
  color: white;
  width: 100%;
  margin-bottom: 5px;
`;

const StyledLoginError = styled.p`
  color: red;
  margin-bottom: 5px;
`;

const StyledFieldContainer = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
`;

const StyledLink = styled(Link)`
  color: white;
  font-size: 24px;
`;

const Login = () => {
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
    <StyledLogin>
      <StyledForm onSubmit={onSubmit}>
        <h1>Logg inn</h1>
        <StyledFieldContainer>
          <StyledLabel>Brukernavn/e-post</StyledLabel>
          <input ref={usernameRef} type="text" placeholder="Brukernavn" name="username" />
        </StyledFieldContainer>
        <StyledFieldContainer>
          <StyledLabel>Passord</StyledLabel>
          <input ref={passwordRef} type="password" placeholder="Passord" name="password" />
        </StyledFieldContainer>
        {errorCode && (
          <div>
            <StyledLoginError>{errorMessage}</StyledLoginError>
          </div>
        )}
        <div>
          <Button onClick={onSubmit} text="Logg inn" />
          <button style={{ display: 'none' }} type="submit" onClick={onSubmit} />
        </div>
      </StyledForm>
      <StyledLink to="/qr-reader">Les av QR-koder</StyledLink>
    </StyledLogin>
  );
};

export default Login;
