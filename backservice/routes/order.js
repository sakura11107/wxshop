const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/orders', async (req, res) => {
    const { userid, items, total } = req.body;
    console.log(req.body);
    let connection;

    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 生成一个新的 UUID 用于订单 ID
        const [uuidResult] = await connection.query('SELECT UUID() as id');
        const orderId = uuidResult[0].id;

        // 插入 orders 表
        const orderQuery = 'INSERT INTO orders (id, user_id, total_price, status) VALUES (?, ?, ?, ?)';
        await connection.query(orderQuery, [orderId, userid, total, 'pending']);

        // 插入 order_items 表
        const itemQuery = 'INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (UUID(), ?, ?, ?, ?)';
        for (const item of items) {
            await connection.query(itemQuery, [orderId, item.id, item.quantity, item.price]);
        }

        await connection.commit();
        res.status(200).json({ message: '订单保存成功', orderId: orderId });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error saving order:', error);
        res.status(500).json({ message: '订单保存失败', error: error.message });
    } finally {
        if (connection) connection.release();
    }
});

// 获取指定用户的所有订单及订单项
router.get('/orders/:userid', async (req, res) => {
    const { userid } = req.params;
    let connection;
    try {
        connection = await db.getConnection();

        // 获取特定用户的所有订单的基本信息
        const [orders] = await connection.query(`
            SELECT id, user_id, total_price, created_at, status
            FROM orders
            WHERE user_id = ?
            ORDER BY created_at DESC
        `, [userid]);

        // 对每个订单获取其商品详情
        for (let order of orders) {
            const [items] = await connection.query(`
                SELECT oi.id, oi.product_id, oi.quantity, oi.price, p.name, p.image_url
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = ?
            `, [order.id]);
            
            order.items = items;
        }
        console.log(orders);

        res.status(200).json(orders);
    } catch (error) {
        console.error('获取订单列表失败:', error);
        res.status(500).json({ message: '获取订单列表失败', error: error.message });
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;