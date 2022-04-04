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

 Date: 04/04/2022 17:58:08
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
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of book
-- ----------------------------
BEGIN;
INSERT INTO `book` VALUES (1, '端开发之路第二版', 'dafdf', 'shangdeng', '软件工程', 123, 'pub_company', '2022-04-03 06:19:38', 100, 98, '2022-04-03 06:19:46', '23123');
INSERT INTO `book` VALUES (5, '后端开发之路第二版', 'dafdf', 'shangdeng', '软件工程', 123, 'pub_company', '2022-04-03 06:19:38', 100, 100, '2022-04-03 06:19:46', '23123');
INSERT INTO `book` VALUES (6, '修改测试112', NULL, '123', '修改测试1', 123, '123', '2022-01-01 10:00:00', 123, 121, '2022-01-01 10:00:00', '123');
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
  `return_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of borrow
-- ----------------------------
BEGIN;
INSERT INTO `borrow` VALUES (1, 1, '1725123119', '2022-12-10 13:38:39', '2023-12-27 13:38:56');
INSERT INTO `borrow` VALUES (2, 3, '1725123119', '2018-10-01 14:31:12', '2019-01-04 14:31:18');
INSERT INTO `borrow` VALUES (3, 4, '1725123119', '2020-06-16 19:16:02', '2022-12-31 21:38:39');
INSERT INTO `borrow` VALUES (5, 5, '1725123119', '2022-12-10 13:38:39', '2023-12-27 13:38:56');
INSERT INTO `borrow` VALUES (6, 5, '123123123', '2023-12-27 00:00:00', '2023-12-26 00:00:00');
INSERT INTO `borrow` VALUES (7, 5, '211123', '2022-12-10 13:38:39', '2023-12-27 13:38:56');
INSERT INTO `borrow` VALUES (9, 6, '123123123', '2022-03-27 00:00:00', '2022-04-24 00:00:00');
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of menus
-- ----------------------------
BEGIN;
INSERT INTO `menus` VALUES (2, '系统管理', 'system', 'system', 'el-icon-user', 0, 1);
INSERT INTO `menus` VALUES (3, '菜单设置', 'menus', 'system/menus', 'el-icon-s-promotion', 2, 1);
INSERT INTO `menus` VALUES (4, '用户管理', 'user', 'system/user', 'el-icon-user', 2, 1);
INSERT INTO `menus` VALUES (45, '评审审核', 'sehnhe', 'src/asdfasdf', 'el-icon-user', 39, 1);
INSERT INTO `menus` VALUES (50, '会议签到', 'meetingSign', 'meetingSign', 'el-icon-user', 48, 1);
INSERT INTO `menus` VALUES (56, '3413241', '123412123123123', '1234123', '12341234', 55, 1);
INSERT INTO `menus` VALUES (58, '书籍管理', 'book', 'book', 'el-icon-s-promotion', 0, 1);
INSERT INTO `menus` VALUES (59, '学生管理', '学生管理', '学生管理', 'el-icon-s-promotion', 0, 1);
INSERT INTO `menus` VALUES (60, '我的借阅', '我的借阅', '我的借阅', 'el-icon-s-promotion', 0, 2);
INSERT INTO `menus` VALUES (61, '图书管理', 'administer', 'book/administer', 'el-icon-s-promotion', 58, 1);
INSERT INTO `menus` VALUES (62, '借阅记录', 'takeNotes', 'book/takeNotes', 'el-icon-s-promotion', 58, 1);
INSERT INTO `menus` VALUES (63, '个人中心', '个人中心', '个人中心', 'el-icon-s-promotion', 0, 2);
INSERT INTO `menus` VALUES (64, '账号信息', '账号信息', '账号信息', '账号信息', 63, 2);
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
  `roleId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createTime` timestamp NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `student_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES (1, 'admin', '1234567890', '软件开发', '1731班', '男', '2001', '2022-04-01 22:14:04', '1912504939@qq.com', '1725123119');
INSERT INTO `user` VALUES (2, 'shangdeng', '1234567890', '123', 'undefined', '男', '2001', '2022-04-01 22:51:04', '1331', '123');
INSERT INTO `user` VALUES (3, '灯若银河', '1234567890', NULL, NULL, '男', '2002', '2022-04-03 13:43:45', NULL, NULL);
INSERT INTO `user` VALUES (5, '杰尼最美', '1234567890', '软件工程', '2022班', '女', '2002', '2022-04-03 13:49:44', '191231231@qq.com', '123123123');
INSERT INTO `user` VALUES (6, '12312', '23123', '0123', 'undefined', '男', NULL, '2022-04-04 11:50:30', 'undefined', '123');
INSERT INTO `user` VALUES (7, 'zhoushangdengsaf', '12345678', '生物学', 'undefined', '男', NULL, '2022-04-04 11:51:37', '19123123@qq.com', '123123123');
INSERT INTO `user` VALUES (9, '杰尼123', '123456789', '软件工程', 'undefined', '女', NULL, '2022-04-04 11:52:43', '191231231@qq.com', '123');
INSERT INTO `user` VALUES (11, '123', '123', '123', 'undefined', '男', NULL, '2022-04-04 13:27:51', '123', '123');
INSERT INTO `user` VALUES (12, '3123123', '123123', '123123', 'undefined', '男', NULL, '2022-04-04 15:47:40', '123', 'undefined');
INSERT INTO `user` VALUES (13, 'werqwer', 'werqwer', 'wer', 'undefined', '男', NULL, '2022-04-04 15:48:56', 'qwerqwer', '0284904123123');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
