const fs = require('fs');
const { version } = require('./package.json');

fs.writeFile('./public/meta.json', JSON.stringify({ version }), 'utf8', (error) => {
  if (error) {
    console.log('An error occured while writing JSON Object to meta.json.');
    throw error;
  }
  console.log('meta.json file has been saved with latest version number.');
});
