/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all active categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
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
 *                         type: object
 *                         properties:
 *                           en: { type: string }
 *                           ar: { type: string }
 *                       imageUrl:
 *                         type: string
 */

const express = require("express");
const { protect } = require("../services/authService");
const { getAllCategories } = require("../services/categoryService");

const router = express.Router();

router.use(protect);
router.get("/", getAllCategories);

module.exports = router;
