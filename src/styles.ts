import { createGlobalStyle } from 'styled-components/macro';
import { gray1, gray3, kinkRed, kinkRedDarker, kinkRedDarkest } from './stylingVariables';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';

export const Login = styled.div`
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

export const SignUp = styled.div`
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

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const Label = styled.label`
  color: white;
  width: 100%;
  margin-bottom: 5px;
`;

export const FormError = styled.p`
  color: red;
  margin-bottom: 5px;
`;

export const FieldContainer = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
`;

export const Link = styled(RouterLink)`
  color: white;
  font-size: 24px;
`;

export const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }
  body {
    margin: 0;
    overflow: auto;
    background-color: black;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    height: 100%;
  }
  #root {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-width: 500px;
  max-height: 900px;
  @media (min-width: 502px) {
    border-left: 1px solid ${gray1};
    border-right: 1px solid ${gray1};
  }
  @media (min-width: 504px) {
    border-left: 2px solid ${gray1};
    border-right: 2px solid ${gray1};
  }
  @media (min-height: 902px) {
    border-top: 1px solid ${gray1};
    border-bottom: 1px solid ${gray1};
  }
  @media (min-height: 904px) {
    border-top: 2px solid ${gray1};
    border-bottom: 2px solid ${gray1};
  }
`;

const style = `
  padding: 10px;
  color: white;
  border: none;
  background-color: ${kinkRed};
  cursor: pointer;
  text-decoration: none;

  :hover {
    background-color: ${kinkRedDarker};
  }

  :active {
    background-color: ${kinkRedDarkest};
  }
`;

export const Button = styled(RouterLink)`
  ${style}
`;

export const ExternalLinkButton = styled.a`
  ${style}
`;

export const Card = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

export const QrImage = styled.img`
  width: 100%;
  height: 100%;
`;

export const Message = styled.div`
  flex: 1;
  display: grid;
  place-items: center;
  color: white;
  font-size: 24px;
  padding: 10px;
`;

export const Container = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%; /* 1:1 Aspect Ratio */
`;

export const ImageContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

export const Hamburger = styled.div<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 2px;
  margin-right: -2px;
`;

export const Info = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  flex-grow: 100;
  font-size: 24px;
  color: white;
`;

export const Menu = styled.div`
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

export const CardChooser = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
`;

export const MenuLink = styled(Link)`
  color: white;
`;

export const Navbar = styled.div`
  background-color: black;
  height: 60px;
  width: 100%;
  display: flex;
  color: white;
  align-items: center;
  border-bottom: 2px solid #222222;
  position: relative;
`;

export const HamburgerWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;

export const SpinnerWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

export const NavbarTitle = styled.div`
  user-select: none;
  width: 100%;
  display: flex;
  justify-content: center;
  font-weight: bolder;
  font-size: 24px;
`;

export const QrReader = styled.div`
  width: 100%;
  flex: 1;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

export const Error = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const CanvasWrapper = styled.div<{ canvasWidth: number }>`
  min-height: ${(props) => (props.canvasWidth * 3) / 4}px;
  max-height: ${(props) => (props.canvasWidth * 5) / 6}px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #333;
  margin: 0 -4px;
`;

export const Spinner = styled.div`
  &,
  &:after {
    border-radius: 50%;
    width: 26px;
    height: 26px;
  }
  & {
    margin-top: 10px;
    margin-right: 10px;
    font-size: 6px;
    position: relative;
    text-indent: -9999em;
    border-top: 1.1em solid rgba(255, 255, 255, 0.2);
    border-right: 1.1em solid rgba(255, 255, 255, 0.2);
    border-bottom: 1.1em solid rgba(255, 255, 255, 0.2);
    border-left: 1.1em solid #ffffff;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation: load8 1.1s infinite linear;
    animation: load8 1.1s infinite linear;
  }
  @-webkit-keyframes load8 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes load8 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
`;

export const Status = styled.div<{ status?: string }>`
  background-color: ${(props) => (props.status ? (props.status === 'isValid' ? 'green' : 'red') : 'yellow')};
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: black;
  font-size: 24px;
`;
