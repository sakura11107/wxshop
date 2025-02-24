const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const db = require('../db'); // 数据库连接

// 微信登录路由
router.post('/login', async (req, res) => {
  const { code, userInfo } = req.body;
  const appid = ''; // 替换为你的AppID
  const secret = ''; // 替换为你的AppSecret

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
      const [result] = await db.query('SELECT * FROM users WHERE openid = ?', [openid]);
      let userId;

      if (result.length === 0) {
        // 用户不存在，插入新用户
        await db.query(
          'INSERT INTO users (id, openid, avatar, name) VALUES (UUID(), ?, ?, ?)',
          [openid, userInfo.avatar, userInfo.nickname]
        );
        
        const [newUserResult] = await db.query('SELECT id FROM users WHERE openid = ?', [openid]);
        userId = newUserResult[0].id;
      } else {
        // 用户已存在
        userId = result[0].id;
      }

      // 生成 JWT token
      const token = jwt.sign({ userId, openid }, '123456', { expiresIn: '7d' });
      res.json({ message: '登录成功', token, openid, userId });
    } else {
      res.status(400).json({ message: '微信登录失败' });
    }
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 更新用户信息路由
router.post('/updateUserInfo', async (req, res) => {
  const { address, phone } = req.body;
  const token = req.headers.authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, '123456');
    const { openid } = decoded;

    await db.query('UPDATE users SET address = ?, phone = ? WHERE openid = ?', [address, phone, openid]);
    res.json({ message: '用户信息更新成功' });
  } catch (err) {
    res.status(500).json({ message: '更新用户信息失败' });
  }
});

// 获取用户信息路由
router.get('/getUserInfo', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: '缺少Authorization头' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, '123456');
    const { openid } = decoded;

    const [result] = await db.query('SELECT name, avatar, address, phone FROM users WHERE openid = ?', [openid]);

    if (result.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json({
      nickName: result[0].name,
      avatarUrl: result[0].avatar,
      address: result[0].address,
      phone: result[0].phone
    });
  } catch (err) {
    res.status(500).json({ message: '获取用户信息失败' });
  }
});

module.exports = router;
