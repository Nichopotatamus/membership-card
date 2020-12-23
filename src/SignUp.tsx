import React, { useMemo, useRef } from 'react';
import styled from 'styled-components/macro';
import Button from './Button';
import { gray1, gray3, kinkRed } from './stylingVariables';
import firebase from 'firebase/app';
import getRealOrFakeEmail from './getRealOrFakeEmail';
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
  const { location } = useHistory();
  const { email, token } = useMemo(() => {
    return qs.parse(location.search, { ignoreQueryPrefix: true, }) as {[key: string]: string};
  }, [location.search]);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const error = [''][0];

  return (
    <StyledSignUp>
      <StyledForm action="/signup" method="post">
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
        {error === 'invalidSignUp' && (
          <div>
            <StyledSignUpError>Wrong username and/or password</StyledSignUpError>
          </div>
        )}
        {error === 'notLoggedIn' && (
          <div>
            <StyledSignUpError>Log in to continue</StyledSignUpError>
          </div>
        )}
        <div>
          <Button
            onClick={async () => {
              const username = usernameRef.current?.value;
              const password = passwordRef.current?.value;
              const confirmPassword = passwordRef.current?.value;
              if (username && password && password === confirmPassword) {
                await fetch(`${process.env.REACT_APP_CLOUD_FUNCTIONS_HOST}/signup`, {
                  method: 'POST',
                  body: JSON.stringify({ username, password, token }),
                  headers: { 'content-type': 'application/json' },
                });
                await firebase.auth().signInWithEmailAndPassword(getRealOrFakeEmail(username), password)
              }
            }}
            text="Registrer"
          />
        </div>
      </StyledForm>
    </StyledSignUp>
  );
};

export default SignUp;
