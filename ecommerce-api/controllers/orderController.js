const db = require("../database/database");

const getOrders = (req, res) => {
    db.all("SELECT * FROM orders", [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);
    });
};

const createOrder = (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        return res.status(400).json({
            error: "Product ID and quantity are required"
        });
    }

    db.run(
        "INSERT INTO orders (productId, quantity) VALUES (?, ?)",
        [productId, quantity],
        function (err) {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                id: this.lastID,
                productId,
                quantity
            });
        }
    );
};

module.exports = {
    getOrders,
    createOrder
};