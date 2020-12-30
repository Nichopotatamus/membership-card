import React, { useMemo, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import Button from './Button';
import { gray1, gray3, kinkRed } from '../stylingVariables';
import firebase from 'firebase/app';
import getRealOrFakeEmail from '../getRealOrFakeEmail';
import { useHistory } from 'react-router-dom';
import qs from 'qs';

const StyledSignUp = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

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

const StyledSignUpError = styled.p`
  color: red;
  margin-bottom: 5px;
`;

const StyledFieldContainer = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
`;

const SignUp = () => {
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
    <StyledSignUp>
      <StyledForm onSubmit={onSubmit}>
        <h1>Registrer ny bruker</h1>
        <StyledFieldContainer>
          <StyledLabel>Brukernavn</StyledLabel>
          <input ref={usernameRef} defaultValue={email} type="text" placeholder="Brukernavn" name="username" />
        </StyledFieldContainer>
        <StyledFieldContainer>
          <StyledLabel>Passord</StyledLabel>
          <input ref={passwordRef} type="password" placeholder="Passord" name="password" />
        </StyledFieldContainer>
        <StyledFieldContainer>
          <StyledLabel>Bekreft passord</StyledLabel>
          <input ref={confirmPasswordRef} type="password" placeholder="Bekreft passord" name="confirm-password" />
        </StyledFieldContainer>
        {errorCode && (
          <div>
            <StyledSignUpError>{errorMessage}</StyledSignUpError>
          </div>
        )}
        <div>
          <Button onClick={onSubmit} text="Registrer" />
          <button style={{ display: 'none' }} type="submit" onClick={onSubmit} />
        </div>
      </StyledForm>
    </StyledSignUp>
  );
};

export default SignUp;
