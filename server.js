const express = require('express');
require('local-env-var');
const redis = require('redis-utils-json');

const app = express();
const store = new redis(process.env.REDIS_URL);

app.get('/', (req, res) => res.send('server online'));

app.get('/api', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.send('no query!');
  console.log('query get:', q);
  const { data, found } = await store.getByKey('queries:all');
  if (!found) {
    await store.setKey('queries:all', JSON.stringify([q]));
  } else {
    console.log(data);
    const newData = JSON.parse(data);
    newData.push(q);
    await store.setKey('queries:all', JSON.stringify(newData));
  }
  res.send('stored');
});



app.listen(process.env.PORT || 8080, () => console.log('server listening on', process.env.PORT));
