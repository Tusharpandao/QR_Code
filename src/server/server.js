const express = require('express');
const mysql = require('mysql');

const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'qrcodes'
});

app.post('/qrcodes', (req, res) => {
  const { content } = req.body;

  connection.query('INSERT INTO qrcodes (content, scan_date) VALUES (?, NOW())', [content], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ success: true, qrCode: { id: result.insertId, content } });
    }
  });
});

app.get('/qrcodes', (req, res) => {
  connection.query('SELECT * FROM qrcodes', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ qrCodes: results });
    }
  });
});

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
