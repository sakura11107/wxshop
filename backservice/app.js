var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var productRoutes = require('./routes/product');
var loginRoutes = require('./routes/login');

var app = express();

app.use(cors());
app.use(express.json());  // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 解析 URL-encoded 请求体

// 使用 product 路由
app.use('/', productRoutes);
app.use('/api', loginRoutes);

module.exports = app;
