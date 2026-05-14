const db = require("../database/database");

const getProducts = (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);
    });
};

const createProduct = (req, res) => {
    const { name, price } = req.body;

    if (!name || !price) {
        return res.status(400).json({
            error: "Name and price are required"
        });
    }

    db.run(
        "INSERT INTO products (name, price) VALUES (?, ?)",
        [name, price],
        function (err) {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                id: this.lastID,
                name,
                price
            });
        }
    );
};

const updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body;

    db.run(
        "UPDATE products SET name = ?, price = ? WHERE id = ?",
        [name, price, id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: "Product not found"
                });
            }

            res.json({
                message: "Product updated successfully"
            });
        }
    );
};

const deleteProduct = (req, res) => {
    const { id } = req.params;

    db.run(
        "DELETE FROM products WHERE id = ?",
        [id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: "Product not found"
                });
            }

            res.json({
                message: "Product deleted successfully"
            });
        }
    );
};

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
};