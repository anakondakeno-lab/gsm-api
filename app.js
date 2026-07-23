const express = require('express');
const mysql = require('mysql2');
const app = express();

// Basit bağlantı kullan (pool değil)
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'kenevizz',
  database: 'gsm_verileri'
});

// Bağlantıyı aç
connection.connect();

app.get('/', (req, res) => {
  res.json({ mesaj: '✅ 145 GSM API Çalışıyor' });
});

// TAM EŞLEŞME - GSM veya TC
app.get('/api/ara', (req, res) => {
  const tc = req.query.tc;
  const gsm = req.query.gsm;
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);

  let sql = 'SELECT * FROM 145mgsm WHERE 1=1';
  const params = [];

  if (tc) {
    sql += ' AND TC = ?';
    params.push(tc);
  }
  if (gsm) {
    sql += ' AND GSM = ?';
    params.push(gsm);
  }
  
  sql += ' LIMIT ?';
  params.push(limit);

  // Sorguyu çalıştır
  connection.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ bulunan: results.length, sonuclar: results });
  });
});

// ID ile getir
app.get('/api/id/:id', (req, res) => {
  connection.query('SELECT * FROM 145mgsm WHERE ID = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Bulunamadı' });
    res.json(results[0]);
  });
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ API çalışıyor: http://localhost:${PORT}`);
});
