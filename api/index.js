
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Transaction = require("./models/Transaction.js");
const mongoose = require("mongoose");
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DB_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.get("/api/test", (req, res) => {
        res.json('test ok');
});

app.post("/api/transaction", async (req, res) => {
        try {
            const {price, name, description, datetime} = req.body;
            const transaction = await Transaction.create({price, name, description, datetime});
            res.json(transaction);
        } catch (err) {
            res.status(500).json({error: err.message});
        }
});

app.get("/api/transactions", async (req, res) => {
    await mongoose.connect(process.env.DB_URL);
    const transactions = await Transaction.find();

    res.json(transactions);
});

app.listen(4000, () => {
    console.log('Server running on port 4000');
});