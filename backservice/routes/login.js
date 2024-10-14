const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const db = require('../db'); // 数据库连接

// 微信登录路由
router.post('/login', async (req, res) => {
  const { code, userInfo } = req.body;


  if (!code) {
    return res.status(400).json({ message: '缺少code' });
  }

  try {
    // 向微信服务器请求 session_key 和 openid
    const wxResponse = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: { appid, secret, js_code: code, grant_type: 'authorization_code' }
    });

    const { openid, session_key } = wxResponse.data;

    if (openid) {
      // 查询数据库中是否已有该用户的 openid
      db.query('SELECT * FROM users WHERE openid = ?', [openid], (err, result) => {
        if (err) {
          return res.status(500).json({ message: '数据库查询失败' });
        }
        let userId; // 用于存储用户的 id
        if (result.length === 0) {
          // 用户不存在，插入新用户
          db.query(
            'INSERT INTO users (id, openid, avatar, name) VALUES (UUID(), ?, ?, ?)',
            [openid, userInfo.avatar, userInfo.nickname],
            (err, insertResult) => {
              if (err) {
                return res.status(500).json({ message: '用户创建失败' });
              }
              // 获取新插入用户的 id
              db.query('SELECT id FROM users WHERE openid = ?', [openid], (err, newUserResult) => {
                if (err) {
                  return res.status(500).json({ message: '查询用户 ID 失败' });
                }
                userId = newUserResult[0].id;
                // 生成 JWT token
                const token = jwt.sign({ userId, openid }, '123456', { expiresIn: '7d' });
                // 返回 token, openid 和用户 id
                res.json({ message: '登录成功', token, openid, userId });
              });
            }
          );
        } else {
          // 用户已存在，获取用户的 id
          userId = result[0].id;
          // 生成 JWT token
          const token = jwt.sign({ userId, openid }, '123456', { expiresIn: '7d' });
          // 返回 token, openid 和用户 id
          res.json({ message: '登录成功', token, openid, userId });
        }
      });
    } else {
      res.status(400).json({ message: '微信登录失败' });
    }
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 新增：更新用户信息路由
router.post('/updateUserInfo', (req, res) => {
  const { address, phone } = req.body;
  const token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, '123456', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: '无效的token' });
    }

    const { openid } = decoded;

    db.query(
      'UPDATE users SET address = ?, phone = ? WHERE openid = ?',
      [address, phone, openid],
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: '更新用户信息失败' });
        }
        res.json({ message: '用户信息更新成功' });
      }
    );
  });
});

// 新增：获取用户信息路由
router.get('/getUserInfo', (req, res) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      return res.status(401).json({ message: '缺少Authorization头' });
    }
  
    const token = authHeader.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: '缺少token' });
    }
  
    jwt.verify(token, '123456', (err, decoded) => {
      if (err) {
        console.error('Token验证失败:', err);
        return res.status(401).json({ message: '无效的token' });
      }
  
      const { openid } = decoded;
  
      db.query(
        'SELECT name, avatar, address, phone FROM users WHERE openid = ?',
        [openid],
        (err, result) => {
          if (err) {
            console.error('获取用户信息失败:', err);
            return res.status(500).json({ message: '获取用户信息失败' });
          }
          if (result.length === 0) {
            return res.status(404).json({ message: '用户不存在' });
          }
          res.json({
            nickName: result[0].name,
            avatarUrl: result[0].avatar,
            address: result[0].address,
            phone: result[0].phone
          });
        }
      );
    });
  });

module.exports = router;