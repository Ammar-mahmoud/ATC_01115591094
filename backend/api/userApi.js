/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Admin operations on users
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Admin - Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                         enum: [user, admin]
 *                       gender:
 *                         type: string
 *                         enum: [Male, Female, null]
 */

const express = require("express");
const filterUsersOnly = require('../middlewares/filter_users');

const router = express.Router();

const { protect, allowedTo } = require("../services/authService");
const { getAllUsers } = require("../services/userService");

router.get("/", protect,  filterUsersOnly, allowedTo("admin"), getAllUsers);

module.exports = router;
