import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import jsQR from 'jsqr';
import MemberInfo from './MemberInfo';
import { MemberData, QrData } from '../types';
import Status from './Status';
import { Point } from 'jsqr/dist/locator';
import jwt from 'jsonwebtoken';

type Props = {};

const StyledQrReader = styled.div`
  flex: 1;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledError = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledCanvasWrapper = styled.div`
  width: 100vw;
  min-height: calc(100vw * 3 / 4);
  max-height: calc(100vw * 5 / 6);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #333;
`;

const checkMember = (memberData: MemberData) => {
  const expiryDate = new Date(memberData.expiry);
  const currentDate = new Date(new Date().toJSON().slice(0, 10));
  if (expiryDate < currentDate) {
    return { isValid: false, message: 'expired' };
  }
  return { isValid: true, message: 'isValid' };
};

const QrReader: React.FC<Props> = () => {
  const timeoutRef = useRef<number>();
  const activeRef = useRef<boolean>(false);
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: window.screen.width,
    height: (window.screen.width * 3) / 4,
  });
  const [memberData, setMemberData] = useState<MemberData | undefined>();
  const [status, setStatus] = useState<{ isValid: boolean; message: string } | undefined>();
  const [hasGetUserMediaError, setHasGetUserMediaError] = useState(false);

  const setDisplay = (qrData: QrData, validSignature: boolean) => {
    clearTimeout(timeoutRef.current);
    const status = validSignature ? checkMember(qrData) : { isValid: false, message: 'invalidSignature' };
    setMemberData(qrData);
    setStatus(status);
    timeoutRef.current = setTimeout(() => {
      setMemberData(undefined);
      setStatus(undefined);
    }, 5000);
  };

  useEffect(() => {
    if (!navigator.mediaDevices) {
      setHasGetUserMediaError(true);
      return;
    }
    activeRef.current = true;
    const video = document.createElement('video');
    const canvas = canvasElementRef.current!.getContext('2d')!;

    function drawLine(begin: Point, end: Point, color: string) {
      canvas.beginPath();
      canvas.moveTo(begin.x, begin.y);
      canvas.lineTo(end.x, end.y);
      canvas.lineWidth = 4;
      canvas.strokeStyle = color;
      canvas.stroke();
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' /* back camera on phones */ } })
      .then((stream) => {
        video.srcObject = stream;
        video.setAttribute('playsinline', 'true'); // required to tell iOS Safari we don't want fullscreen
        video.play().then(() => requestAnimationFrame(tick));
      })
      .catch((error) => {
        console.error(error);
        setHasGetUserMediaError(true);
      });

    function tick() {
      if (canvasElementRef.current && video.readyState === video.HAVE_ENOUGH_DATA) {
        const ratio = video.videoHeight / video.videoWidth;
        const canvasHeight = window.screen.width * ratio;
        const canvasWidth = window.screen.width;
        if (canvasDimensions.width !== canvasWidth || canvasDimensions.height !== canvasHeight) {
          setCanvasDimensions({ width: canvasWidth, height: canvasHeight });
        }

        canvas.drawImage(video, 0, 0, canvasElementRef.current.width, canvasElementRef.current.height);
        const imageData = canvas.getImageData(0, 0, canvasElementRef.current.width, canvasElementRef.current.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code) {
          drawLine(code.location.topLeftCorner, code.location.topRightCorner, '#FF3B58');
          drawLine(code.location.topRightCorner, code.location.bottomRightCorner, '#FF3B58');
          drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, '#FF3B58');
          drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, '#FF3B58');

          try {
            const json = jwt.decode(code.data) as QrData;
            let validSignature = false;
            try {
              jwt.verify(code.data, process.env.REACT_APP_JWT_PUBLIC_KEY as jwt.Secret);
              validSignature = true;
            } catch {
              console.log('Invalid signature');
            }

            setDisplay(json, validSignature);
            console.log(json);
          } catch (error) {
            console.error('Could not parse JSON: ', code.data);
          }
        }
      }
      if (activeRef.current) {
        requestAnimationFrame(tick);
      }
      return () => (activeRef.current = false);
    }
  }, [canvasDimensions.height, canvasDimensions.width]);

  return (
    <StyledQrReader>
      {hasGetUserMediaError ? (
        <StyledError>
          <p>Kunne ikke starte kamera. Sjekk at du har gitt tilgang og at du kjører en støttet nettleser.</p>
          <p>Støttede nettlesere:</p>
          <ul>
            <li>Safari 11, eller nyere (iOS)</li>
            <li>Chrome 52, Firefox 36, Opera 41, eller nyere (Android)</li>
          </ul>
        </StyledError>
      ) : (
        <>
          <StyledCanvasWrapper>
            <canvas
              ref={canvasElementRef}
              id="canvas"
              height={canvasDimensions.height}
              width={canvasDimensions.width}
            />
          </StyledCanvasWrapper>
          <Status status={status?.message} />
          {memberData && <MemberInfo memberData={memberData} />}
        </>
      )}
    </StyledQrReader>
  );
};

export default QrReader;
