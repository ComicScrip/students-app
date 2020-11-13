const fs = require('fs');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

const goReadFile = (path, options) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, options, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

app.get('/students', (req, res) => {
  setTimeout(() => {
    goReadFile('./cleanedStudents.json', { encoding: 'utf-8' })
      .then((data) => {
        res.json(JSON.parse(data));
      })
      .catch((err) => {
        res.status(500);
        res.json({ error: { message: err.message, details: err } });
      });
  }, 3000);
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`server listenting on port ${PORT}`); // eslint-disable-line
});
