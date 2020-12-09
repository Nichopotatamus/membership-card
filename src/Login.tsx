import React, {useRef, useState} from 'react';
import styled from 'styled-components/macro';
import Button from './Button';
import { gray1, gray3, kinkRed } from './stylingVariables';
import { useAppContextValue } from './AppContext';
import { Redirect } from 'react-router-dom';

const StyledLogin = styled.div`
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

const StyledLoginError = styled.p`
  color: red;
  margin-bottom: 5px;
`;

const StyledFieldContainer = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
`;

const Login = () => {
  const { setIsLoggedIn } = useAppContextValue();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const error = [''][0];
  if(shouldRedirect) {
    return <Redirect to="/" />
  }
  return (
    <StyledLogin>
      <StyledForm action="/login" method="post">
        <h1>Login</h1>
        <StyledFieldContainer>
          <StyledLabel>E-post</StyledLabel>
          <input ref={usernameRef} type="text" placeholder="E-post" name="email" />
        </StyledFieldContainer>
        <StyledFieldContainer>
          <StyledLabel>Passord</StyledLabel>
          <input ref={passwordRef} type="password" placeholder="Passord" name="password" />
        </StyledFieldContainer>
        {error === 'invalidLogin' && (
          <div>
            <StyledLoginError>Wrong username and/or password</StyledLoginError>
          </div>
        )}
        {error === 'notLoggedIn' && (
          <div>
            <StyledLoginError>Log in to continue</StyledLoginError>
          </div>
        )}
        <div>
          <Button
            onClick={() => {
              setIsLoggedIn(true);
              setShouldRedirect(true);
            }}
            text="Log in"
          />
        </div>
      </StyledForm>
    </StyledLogin>
  );
};

export default Login;
