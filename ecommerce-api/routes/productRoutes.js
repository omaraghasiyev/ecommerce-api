const express = require("express");

const router = express.Router();

const {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/", getProducts);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     responses:
 *       201:
 *         description: Product created
 */
router.post("/", createProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     responses:
 *       200:
 *         description: Product updated
 */
router.put("/:id", updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     responses:
 *       200:
 *         description: Product deleted
 */
router.delete("/:id", deleteProduct);

module.exports = router;