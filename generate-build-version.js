const fs = require('fs');
const packageJson = require('./package.json');

const appVersion = packageJson.version;

const jsonData = {
  version: appVersion,
};

const jsonContent = JSON.stringify(jsonData);

fs.writeFile('./public/meta.json', jsonContent, 'utf8', (error) => {
  if (error) {
    console.log('An error occured while writing JSON Object to meta.json');
    console.log(error);
  }
  console.log('meta.json file has been saved with latest version number');
});
