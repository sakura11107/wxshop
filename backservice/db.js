const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'wxshop'
});

db.connect((err) => {
  if (err) {
    console.error('无法连接到数据库:', err);
  } else {
    console.log('成功连接到数据库');
  }
});

module.exports = db;
