const express = require("express");
const cors = require("cors");
const db = require("./database/database");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const authMiddleware = require("./middleware/authMiddleware");
const errorMiddleware = require("./middleware/errorMiddleware");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const PORT = 3000;
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "E-commerce API",
            version: "1.0.0",
            description: "Simple cloud-based e-commerce REST API"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ]
    },
    apis: ["./server.js", "./routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

app.use(cors());
app.use(express.json());


// Home Route
app.get("/", (req, res) => {
    res.json({
        message: "E-commerce API is running"
    });
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);



/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     responses:
 *       201:
 *         description: User registered
 */
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            error: "Username and password are required"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, hashedPassword],
        function (err) {
            if (err) {
                return res.status(500).json({
                    error: "User already exists"
                });
            }

            res.status(201).json({
                message: "User registered successfully"
            });
        }
    );
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     responses:
 *       200:
 *         description: Login successful
 */
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        async (err, user) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!user) {
                return res.status(404).json({
                    error: "User not found"
                });
            }

            const validPassword = await bcrypt.compare(
                password,
                user.password
            );

            if (!validPassword) {
                return res.status(401).json({
                    error: "Invalid password"
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    username: user.username
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                }
            );

            res.json({
                message: "Login successful",
                token
            });
        }
    );
});

/**
 * @swagger
 * /protected:
 *   get:
 *     summary: Protected route
 *     responses:
 *       200:
 *         description: Access granted
 */
app.get("/protected", authMiddleware, (req, res) => {
    res.json({
        message: "Protected data accessed",
        user: req.user
    });
});

app.use(errorMiddleware);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

});