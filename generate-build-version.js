const fs = require('fs');
const { version } = require('./package.json');

const meta = process.env.REACT_APP_BUILD_TIMESTAMP
  ? { version, buildTimestamp: process.env.REACT_APP_BUILD_TIMESTAMP }
  : { version };

fs.writeFile('./public/meta.json', JSON.stringify(meta), 'utf8', (error) => {
  if (error) {
    console.log('An error occurred while writing JSON Object to meta.json.');
    throw error;
  }
  process.env.REACT_APP_BUILD_TIMESTAMP
    ? console.log('meta.json file has been saved with latest version number and build timestamp.')
    : console.log('meta.json file has been saved with latest version number.');
});
