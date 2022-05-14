/*
 Navicat Premium Data Transfer

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 80023
 Source Host           : localhost:3306
 Source Schema         : librarian

 Target Server Type    : MySQL
 Target Server Version : 80023
 File Encoding         : 65001

 Date: 14/05/2022 15:41:28
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for book
-- ----------------------------
DROP TABLE IF EXISTS `book`;
CREATE TABLE `book` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `img_path` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `writer` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `sort_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `price` int DEFAULT NULL,
  `pub_company` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `pub_date` datetime DEFAULT NULL,
  `total_num` int DEFAULT NULL,
  `current_num` int DEFAULT NULL,
  `buy_date` datetime DEFAULT NULL,
  `brief` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `lend_sum` int DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of book
-- ----------------------------
BEGIN;
INSERT INTO `book` VALUES (13, '活着', NULL, '余华', '文学', 29, '新华书局', '2022-04-07 00:00:00', 100, 99, '2022-04-09 00:00:00', '活着讲述了人如何去承受巨大的苦难', 2);
INSERT INTO `book` VALUES (14, '人间失格', NULL, '太宰治', '文学', 30, '不知名出版社', '2022-04-09 00:00:00', 100, 99, '2022-04-03 00:00:00', '人间失格', 3);
INSERT INTO `book` VALUES (15, '三体', NULL, '刘慈欣', '科幻', 39, '三体出版社', '2008-04-11 00:00:00', 100, 100, '2022-04-01 00:00:00', '文化大革命如火如荼地进行，天文学家叶文洁在其间历经劫难，被带到军方绝秘计划“红岸工程”。叶文洁以太阳为天线，向宇宙发出地球文明的第一声啼鸣......', 2);
INSERT INTO `book` VALUES (16, '生死疲劳', NULL, '莫言', '奇幻', 39, '莫言', '2022-05-14 15:19:40', 100, 100, '2022-05-14 15:19:47', '轮回', 2);
INSERT INTO `book` VALUES (17, '红与黑', NULL, '汤达', '剧情', 40, '汤达', '2022-05-14 15:21:13', 100, 100, '2022-05-14 15:21:19', '法国', 0);
INSERT INTO `book` VALUES (18, '百年孤独', NULL, '加西亚·马尔克斯', '魔幻现实主义文学', 39, '加西亚·马尔克斯', '2022-05-14 15:23:25', 100, 100, '2022-05-14 15:23:38', '哥伦比亚', 0);
COMMIT;

-- ----------------------------
-- Table structure for borrow
-- ----------------------------
DROP TABLE IF EXISTS `borrow`;
CREATE TABLE `borrow` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_id` int DEFAULT NULL,
  `student_code` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `borrow_date` datetime DEFAULT NULL,
  `return_date` varchar(255) DEFAULT NULL,
  `state` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of borrow
-- ----------------------------
BEGIN;
INSERT INTO `borrow` VALUES (18, 15, '2025123119', '2022-04-09 00:00:00', '2022-04-09', 'Returned');
INSERT INTO `borrow` VALUES (19, 14, '2025123118', '2022-04-09 00:00:00', '', 'Notyet');
INSERT INTO `borrow` VALUES (20, 13, '2025123119', '2022-04-09 00:00:00', '', 'Notyet');
COMMIT;

-- ----------------------------
-- Table structure for menus
-- ----------------------------
DROP TABLE IF EXISTS `menus`;
CREATE TABLE `menus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `menusName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `path` varchar(255) NOT NULL,
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `parentID` int unsigned NOT NULL DEFAULT '1',
  `type` int NOT NULL DEFAULT '1',
  `role_id` int DEFAULT '2002',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of menus
-- ----------------------------
BEGIN;
INSERT INTO `menus` VALUES (2, '系统管理', 'system', 'system', 'el-icon-user', 0, 1, 2001);
INSERT INTO `menus` VALUES (3, '菜单设置', 'menus', 'system/menus', 'el-icon-s-promotion', 2, 1, 2001);
INSERT INTO `menus` VALUES (4, '用户管理', 'user', 'system/user', 'el-icon-user', 2, 1, 2001);
INSERT INTO `menus` VALUES (58, '书籍管理', 'book', 'book', 'el-icon-s-promotion', 0, 1, 2001);
INSERT INTO `menus` VALUES (61, '图书管理', 'administer', 'book/administer', 'el-icon-s-promotion', 58, 1, 2001);
INSERT INTO `menus` VALUES (62, '借阅记录', 'takeNotes', 'book/takeNotes', 'el-icon-s-promotion', 58, 1, 2001);
INSERT INTO `menus` VALUES (63, '个人中心', 'personal', 'personal', 'el-icon-s-promotion', 0, 1, 2002);
INSERT INTO `menus` VALUES (64, '账号信息', 'account', 'personal/account', 'el-icon-s-promotion', 63, 1, 2002);
INSERT INTO `menus` VALUES (65, '我的借书记录', 'record', 'personal/record', 'el-icon-s-promotion', 63, 1, 2002);
COMMIT;

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `createTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of role
-- ----------------------------
BEGIN;
INSERT INTO `role` VALUES (2001, '管理员', '2022-04-04 13:09:08');
INSERT INTO `role` VALUES (2002, '学生', '2022-04-04 13:09:20');
COMMIT;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `major` varchar(255) DEFAULT NULL,
  `class_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `sex` enum('男','女') NOT NULL,
  `role_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createTime` timestamp NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `student_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES (1, 'admin', '1234567890', '软件开发', '202223', '男', '2001', '2022-04-01 22:14:04', '1912504939@qq.com', '2025123119');
INSERT INTO `user` VALUES (2, 'shangdeng', '1234567890', '123', '2022', '男', '2002', '2022-04-01 22:51:04', '1331', '2025123118');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
