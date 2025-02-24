/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80032 (8.0.32)
 Source Host           : localhost:3306
 Source Schema         : wxshop

 Target Server Type    : MySQL
 Target Server Version : 80032 (8.0.32)
 File Encoding         : 65001

 Date: 21/10/2024 14:44:54
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for favorites
-- ----------------------------
DROP TABLE IF EXISTS `favorites`;
CREATE TABLE `favorites`  (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `user_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `product_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  INDEX `product_id`(`product_id` ASC) USING BTREE,
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of favorites
-- ----------------------------
INSERT INTO `favorites` VALUES ('138ca8ac-8a13-11ef-b136-04d4c4df266b', '8138583b-8939-11ef-b136-04d4c4df266b', 'ce272d17-888d-11ef-b136-04d4c4df266b');
INSERT INTO `favorites` VALUES ('a098b107-8a3d-11ef-b136-04d4c4df266b', '8138583b-8939-11ef-b136-04d4c4df266b', 'ce273d10-888d-11ef-b136-04d4c4df266b');
INSERT INTO `favorites` VALUES ('ade00427-8a19-11ef-b136-04d4c4df266b', '8138583b-8939-11ef-b136-04d4c4df266b', 'd6cdbff4-888d-11ef-b136-04d4c4df266b');
INSERT INTO `favorites` VALUES ('d7ba54fa-8e24-11ef-b136-04d4c4df266b', '8138583b-8939-11ef-b136-04d4c4df266b', 'ce273d8c-888d-11ef-b136-04d4c4df266b');

-- ----------------------------
-- Table structure for order_items
-- ----------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items`  (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `order_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `product_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10, 2) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `order_id`(`order_id` ASC) USING BTREE,
  INDEX `product_id`(`product_id` ASC) USING BTREE,
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of order_items
-- ----------------------------
INSERT INTO `order_items` VALUES ('607ba2b7-8e21-11ef-b136-04d4c4df266b', '607b27af-8e21-11ef-b136-04d4c4df266b', 'ce271894-888d-11ef-b136-04d4c4df266b', 4, 10.99);
INSERT INTO `order_items` VALUES ('607bc116-8e21-11ef-b136-04d4c4df266b', '607b27af-8e21-11ef-b136-04d4c4df266b', 'd6cdda9d-888d-11ef-b136-04d4c4df266b', 4, 25.00);
INSERT INTO `order_items` VALUES ('78ffe81b-8dfc-11ef-b136-04d4c4df266b', '78ff68ec-8dfc-11ef-b136-04d4c4df266b', 'ce271894-888d-11ef-b136-04d4c4df266b', 1, 10.99);
INSERT INTO `order_items` VALUES ('cfa16216-8e24-11ef-b136-04d4c4df266b', 'cfa0d0fb-8e24-11ef-b136-04d4c4df266b', 'ce272d17-888d-11ef-b136-04d4c4df266b', 3, 12.50);
INSERT INTO `order_items` VALUES ('cfa1e609-8e24-11ef-b136-04d4c4df266b', 'cfa0d0fb-8e24-11ef-b136-04d4c4df266b', 'ce273be8-888d-11ef-b136-04d4c4df266b', 3, 9.75);
INSERT INTO `order_items` VALUES ('e59f6a4c-8dfc-11ef-b136-04d4c4df266b', 'e59eeff4-8dfc-11ef-b136-04d4c4df266b', 'd6cdbff4-888d-11ef-b136-04d4c4df266b', 2, 10.99);
INSERT INTO `order_items` VALUES ('e59f9256-8dfc-11ef-b136-04d4c4df266b', 'e59eeff4-8dfc-11ef-b136-04d4c4df266b', 'd6cdd9d4-888d-11ef-b136-04d4c4df266b', 2, 9.75);

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders`  (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `user_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `total_price` decimal(10, 2) NOT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of orders
-- ----------------------------
INSERT INTO `orders` VALUES ('607b27af-8e21-11ef-b136-04d4c4df266b', '8138583b-8939-11ef-b136-04d4c4df266b', 143.96, '2024-10-19 21:52:27', 'pending');
INSERT INTO `orders` VALUES ('78ff68ec-8dfc-11ef-b136-04d4c4df266b', '8138583b-8939-11ef-b136-04d4c4df266b', 10.99, '2024-10-19 17:28:17', 'shipped');
INSERT INTO `orders` VALUES ('cfa0d0fb-8e24-11ef-b136-04d4c4df266b', '8138583b-8939-11ef-b136-04d4c4df266b', 66.75, '2024-10-19 22:17:02', 'pending');
INSERT INTO `orders` VALUES ('e59eeff4-8dfc-11ef-b136-04d4c4df266b', '8138583b-8939-11ef-b136-04d4c4df266b', 41.48, '2024-10-19 17:31:19', 'completed');

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products`  (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `price` decimal(10, 2) NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `stock` int NOT NULL DEFAULT 0,
  `category` enum('鸡','其他') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '其他',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of products
-- ----------------------------
INSERT INTO `products` VALUES ('ce271894-888d-11ef-b136-04d4c4df266b', 'logo.png', '鸡1', 10.99, '123', 100, '鸡');
INSERT INTO `products` VALUES ('ce272d17-888d-11ef-b136-04d4c4df266b', 'logo.png', '鸡2', 12.50, '123', 150, '鸡');
INSERT INTO `products` VALUES ('ce273be8-888d-11ef-b136-04d4c4df266b', 'logo.png', '鸡3', 9.75, '123', 80, '鸡');
INSERT INTO `products` VALUES ('ce273d10-888d-11ef-b136-04d4c4df266b', 'logo.png', '商品A', 19.99, '123', 50, '其他');
INSERT INTO `products` VALUES ('ce273d8c-888d-11ef-b136-04d4c4df266b', 'logo.png', '商品B', 25.00, '123', 120, '其他');
INSERT INTO `products` VALUES ('ce273df1-888d-11ef-b136-04d4c4df266b', 'logo.png', '商品C', 18.75, '123', 200, '其他');
INSERT INTO `products` VALUES ('d6cdbff4-888d-11ef-b136-04d4c4df266b', 'logo.png', '鸡4', 10.99, '123', 100, '鸡');
INSERT INTO `products` VALUES ('d6cdd8dd-888d-11ef-b136-04d4c4df266b', 'logo.png', '鸡5', 12.50, '123', 150, '鸡');
INSERT INTO `products` VALUES ('d6cdd9d4-888d-11ef-b136-04d4c4df266b', 'logo.png', '鸡6', 9.75, '123', 80, '鸡');
INSERT INTO `products` VALUES ('d6cdda42-888d-11ef-b136-04d4c4df266b', 'logo.png', '商品E', 19.99, '123', 50, '其他');
INSERT INTO `products` VALUES ('d6cdda9d-888d-11ef-b136-04d4c4df266b', 'logo.png', '商品F', 25.00, '123', 120, '其他');
INSERT INTO `products` VALUES ('d6cddaf6-888d-11ef-b136-04d4c4df266b', 'logo.png', '商品G', 18.75, '123', 200, '其他');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `openid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('8138583b-8939-11ef-b136-04d4c4df266b', 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132', '微信用户', '123', '地球', 'oRJmY4usyANq1NEvVbxhqs-99Hdw');

SET FOREIGN_KEY_CHECKS = 1;
