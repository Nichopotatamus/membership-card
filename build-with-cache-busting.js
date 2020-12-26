const execSync = require('child_process').execSync;
const env = Object.create(process.env);
const command = 'npm run build';
env.REACT_APP_BUILD_TIMESTAMP = new Date().getTime();

console.log(`Used env variables: ${JSON.stringify(env)}`);
console.log(`Run command: ${command}`);
execSync(command, { env, stdio: 'inherit' });
