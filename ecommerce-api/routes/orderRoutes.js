const express = require("express");

const router = express.Router();

const {
    getOrders,
    createOrder
} = require("../controllers/orderController");

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/", getOrders);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     responses:
 *       201:
 *         description: Order created
 */
router.post("/", createOrder);

module.exports = router;