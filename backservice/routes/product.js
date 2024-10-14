const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken'); // 确保已安装jsonwebtoken包

const JWT_SECRET = '123456'; //
// 中间件：验证token并解析用户ID
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
    //console.log('user:', user); // 添加日志，检查解析出的用户信息是否正确
  });
};

// 获取所有商品
router.get('/', (req, res) => {
  db.query('SELECT * FROM products', (err, info) => {
    if (err) {
      res.status(500).send('数据库查询失败: ' + err).end();
    } else {
      res.send(info).end();
    }
  });
});

// 添加商品到收藏
router.post('/favorites', authenticateToken, (req, res) => {
  //const userId = req.user.id; // 从token中获取用户ID
  
  const { product_id } = req.body;
  const { user_id } = req.body; // 从token中获取用户ID
  // console.log('@@@@@',req.body); 
  // console.log('userId:', user_id);  // 添加日志，检查userId是否正确
  // console.log('product_id:', product_id); // 检查product_id是否正确

  // 先检查是否已经收藏了该商品
  db.query('SELECT * FROM favorites WHERE user_id = ? AND product_id = ?', [user_id, product_id], (err, results) => {
    if (err) {
      return res.status(500).send('数据库查询失败: ' + err).end();
    }
    if (results.length > 0) {
      return res.status(400).send('该商品已在收藏列表中').end();
    }
    // 如果未收藏，添加到收藏
    db.query('INSERT INTO favorites (id,user_id, product_id) VALUES (UUID(),?, ?)', [user_id, product_id], (err, result) => {
      if (err) {
        res.status(500).send('添加收藏失败: ' + err).end();
      } else {
        res.status(201).send({ message: '成功添加收藏', favoriteId: result.insertId }).end();
      }
    });
  });
});

// 从收藏中移除商品
router.delete('/favorites', authenticateToken, (req, res) => {
  const { user_id } = req.body; // 从token中获取用户ID
  const { product_id } = req.body;
  db.query('DELETE FROM favorites WHERE user_id = ? AND product_id = ?', [user_id, product_id], (err, result) => {
    if (err) {
      res.status(500).send('移除收藏失败: ' + err).end();
    } else {
      res.status(200).send('成功移除收藏').end();
    }
  });
});

// 获取用户的收藏
router.post('/favoritesproduct', authenticateToken, (req, res) => {
  const { user_id } = req.body;  // 从token中获取用户ID
  //console.log('user_id:', user_id); // 添加日志，检查userId是否正确
  db.query('SELECT p.* FROM products p JOIN favorites f ON p.id = f.product_id WHERE f.user_id = ?', [user_id], (err, info) => {
    if (err) {
      res.status(500).send('获取收藏失败: ' + err).end();
    } else {
      res.send(info).end();
      //console.log('info:', info); // 添加日志，检查返回的收藏商品是否正确
    }
  });
});

module.exports = router;