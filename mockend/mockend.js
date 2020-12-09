const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 3001;

const mockData = require('./mockData');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send({ msg: 'it works' });
});

app.get('/user', (req, res) => {
  res.send(mockData);
});

app.listen(port, () => console.log('Mockend started'));
