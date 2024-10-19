const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken'); // 确保已安装jsonwebtoken包

const JWT_SECRET = '123456';
// 中间件：验证token并解析用户ID
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// 获取所有商品
router.get('/', async (req, res) => {
  try {
    const [info] = await db.query('SELECT * FROM products');
    res.send(info).end();
  } catch (err) {
    res.status(500).send('数据库查询失败: ' + err).end();
  }
});

// 添加商品到收藏
router.post('/favorites', authenticateToken, async (req, res) => {
  const { product_id, user_id } = req.body;

  try {
    // 先检查是否已经收藏了该商品
    const [results] = await db.query('SELECT * FROM favorites WHERE user_id = ? AND product_id = ?', [user_id, product_id]);
    if (results.length > 0) {
      return res.status(400).send('该商品已在收藏列表中').end();
    }

    // 如果未收藏，添加到收藏
    const [result] = await db.query('INSERT INTO favorites (id, user_id, product_id) VALUES (UUID(), ?, ?)', [user_id, product_id]);
    res.status(201).send({ message: '成功添加收藏', favoriteId: result.insertId }).end();
  } catch (err) {
    res.status(500).send('添加收藏失败: ' + err).end();
  }
});

// 从收藏中移除商品
router.delete('/favorites', authenticateToken, async (req, res) => {
  const { user_id, product_id } = req.body;

  try {
    await db.query('DELETE FROM favorites WHERE user_id = ? AND product_id = ?', [user_id, product_id]);
    res.status(200).send('成功移除收藏').end();
  } catch (err) {
    res.status(500).send('移除收藏失败: ' + err).end();
  }
});

// 获取用户的收藏
router.post('/favoritesproduct', authenticateToken, async (req, res) => {
  const { user_id } = req.body;

  try {
    const [info] = await db.query('SELECT p.* FROM products p JOIN favorites f ON p.id = f.product_id WHERE f.user_id = ?', [user_id]);
    res.send(info).end();
  } catch (err) {
    res.status(500).send('获取收藏失败: ' + err).end();
  }
});

module.exports = router;
