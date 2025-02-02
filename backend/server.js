require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
const API_KEY = process.env.GEMINI_API_KEY;

app.post("/api/gemini", async (req, res) => {
    try {
        const { prompt } = req.body;
        
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }],
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching Gemini response" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
