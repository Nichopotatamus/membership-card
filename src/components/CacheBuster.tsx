import React, { useEffect } from 'react';
import { version } from '../../package.json';
import { useAppContextValue } from './AppContext';
const environment = process.env.NODE_ENV;
const buildTimestamp = process.env.REACT_APP_BUILD_TIMESTAMP;

const CacheBuster: React.FC = () => {
  const { setVersion } = useAppContextValue();
  useEffect(() => {
    const versionString = `${version}${buildTimestamp ? ` (${buildTimestamp})` : ''}`;
    console.info(`Skog & Mark version ${versionString}, environment ${environment}`);
    if (environment === 'production') {
      setVersion(versionString);
      fetch(`/meta.json?_=${new Date().getTime()}`)
        .then((response) => response.json())
        .then(async (meta) => {
          if ((buildTimestamp && buildTimestamp !== meta.buildTimestamp) || meta.version !== version) {
            navigator.serviceWorker?.getRegistrations().then(async (registrations) => {
              await Promise.all(registrations.map((registration) => registration.unregister()));
            });
            window.location.reload();
          }
        })
        .catch(() => console.log('Fetching meta.json failed, continuing with currently cached version of app.'));
    }
  }, []);
  return null;
};

export default CacheBuster;
