const request = require("supertest");
const express = require("express");

const app = express();

app.use(express.json());

describe("Basic API Test", () => {
    test("GET / should return success message", async () => {
        app.get("/", (req, res) => {
            res.status(200).json({
                message: "API working"
            });
        });

        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);

        expect(response.body.message).toBe("API working");
    });
});