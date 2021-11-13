const express = require('express');
const { readFile, writeFile } = require('fs').promises;

const app = express();

app.use(express.static('public'));
app.use(express.json());

app
  .post('/', async (req, res) => {
    await writeFile('./data/db.json', JSON.stringify(req.body), 'utf8');
    res.end('ok');
  })
  .get('/all', async (req, res) => {
    await res.json(await readFile('./data/db.json', 'utf8'));
  })
  .get('/active', async (req, res) => {
    const arr = JSON.parse(await readFile('./data/db.json', 'utf8'));
    const arrActive = arr.filter((el) => el.isDone === false);
    await res.json(JSON.stringify(arrActive));
  })
  .get('/completed', async (req, res) => {
    const arr = JSON.parse(await readFile('./data/db.json', 'utf8'));
    const arrCompleted = arr.filter((el) => el.isDone === true);
    await res.json(JSON.stringify(arrCompleted));
  });

app.listen(3000);
