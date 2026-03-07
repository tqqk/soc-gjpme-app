// knihovny 
require("dotenv").config();
const { Pool } = require("pg");
const express = require("express");
const cors = require("cors");

// proměnné
const app = express();
const PORT = 3000;

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json()); 

// připojení k databázi
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// api pro získání všech otázek
app.get("/api/questions", (req, res) => {
    pool.query("SELECT id, orderNumber, question, options FROM questions ORDER BY orderNumber", 
        (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                const questions = result.rows.map((row) => ({
                    id: row.id,
                    orderNumber: row.ordernumber,
                    question: row.question,
                    options: row.options,
                }));
                res.json(questions);
            }
        }
    );
});

// api pro odeslání odpovědí
app.post("/api/submit", (req, res) => {
    const { questionId, answer } = req.body;

    if (!questionId || !answer) {
        return res.status(400).json({ error: "Je nutné zadat ID otázky a odpověď." });
    }

    pool.query(
        "SELECT correctanswer FROM questions WHERE id = $1",
        [questionId],
        (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else if (result.rows.length === 0) {
                res.status(404).json({ error: "Otázka nenalezena." });
            } else {
                const isCorrect = result.rows[0].correctanswer === answer;
                res.json({ correct: isCorrect });
            }
        }
    );
});

// zapnout server
app.listen(PORT, () => {
    console.log(`Server běží na http://localhost:${PORT}`);

    // self-ping aby server nezaspal
    const SELF_URL = process.env.SELF_URL;
    if (SELF_URL) {
        setInterval(() => {
            fetch(SELF_URL).catch(() => {});
        }, 10 * 60 * 1000); // každých 10 minut
    }
});
