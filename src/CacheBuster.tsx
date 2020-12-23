import React, { useEffect } from 'react';
import { version } from '../package.json';

const CacheBuster: React.FC = () => {
  console.log(`Skog & Mark version ${version}, environment ${process.env.NODE_ENV}`);
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetch('/meta.json')
      .then((response) => response.json())
      .then(async (meta) => {
        if (meta.version !== version) {
          if (caches) {
            // Service worker cache should be cleared with caches.delete()
            await caches.keys().then((names) => Promise.all(names.map((name) => caches.delete(name))));
          }
          window.location.reload();
        }
      })
      .catch(() => console.log('Fetching meta.json failed, continuing with currently cached version of app.'));
  }, []);
  return null;
};

export default CacheBuster;