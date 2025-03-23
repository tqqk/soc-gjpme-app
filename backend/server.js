// knihovny 
const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const cors = require("cors");

// proměnné
const app = express();
const PORT = 3000; // 

app.use(cors({
    origin: "http://127.0.0.1:5500",  
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json()); 

// připojení k databázi
const db = new sqlite3.Database("./questions.db", (err) => {
    if (err) {
        console.error("Chyba při připojování k databázi:", err.message);
    } else {
        console.log("Připojeno k SQLite databázi.");
    }
});

// vytvoření tabulky pokud neexistuje
db.run(
    `CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderNumber INTEGER NOT NULL,
        question TEXT NOT NULL,
        options TEXT NOT NULL,  -- Možnosti ukládáme jako JSON
        correctAnswer TEXT NOT NULL
    )`,
    (err) => {
        if (err) {
            console.error("Chyba při vytváření tabulky:", err.message); 
        }
    }
);

// api pro získání všech otázek
app.get("/api/questions", (req, res) => {
    db.all(
        "SELECT id, orderNumber, question, options FROM questions ORDER BY orderNumber", 
        (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message }); 
            } else {
                const questions = rows.map((row) => ({
                    id: row.id,
                    orderNumber: row.orderNumber,
                    question: row.question,
                    options: JSON.parse(row.options),
                }));
                res.json(questions);
            }
        }
    );
});

// api pro získání otázky podle order čísla
app.get("/api/questions/:orderNumber", (req, res) => {
    const orderNumber = req.params.orderNumber; 

    db.get(
        "SELECT id, orderNumber, question, options, correctAnswer FROM questions WHERE orderNumber = ?",
        [orderNumber],
        (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message }); 
            } else if (!row) {
                res.status(404).json({ error: "Otázka nenalezena." }); 
            } else {
                res.json({
                    id: row.id,
                    orderNumber: row.orderNumber,
                    question: row.question,
                    options: JSON.parse(row.options), 
                });
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

    db.get(
        "SELECT correctAnswer FROM questions WHERE id = ?",
        [questionId],
        (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else if (!row) {
                res.status(404).json({ error: "Otázka nenalezena." });
            } else {
                const isCorrect = row.correctAnswer === answer;
                res.json({ correct: isCorrect });
            }
        }
    );
});

// zapnout server
app.listen(PORT, () => {
    console.log(`Server běží na http://localhost:${PORT}`); 
});
