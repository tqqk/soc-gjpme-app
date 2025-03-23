// knihovny
const sqlite3 = require("sqlite3").verbose();

// nová databáze
const db = new sqlite3.Database("./questions.db");

// otázky
const questions = [
    {
        order: 1,
        question: "Otázka 1",
        options: ["Odpověd 1", "Odpověd 2", "Odpověd 3", "Odpověd 4"],
        correctAnswer: "Odpověd 1",
    },
    {
        order: 2, 
        question: "Otázka 2",
        options: ["Odpověd 1", "Odpověd 2", "Odpověd 3", "Odpověd 4"],
        correctAnswer: "Odpověd 2",
    },
];

// vytvoření databáze
db.serialize(() => {

    // smaž celou tabulku s otazkami pokud již existuje
    db.run("DROP TABLE IF EXISTS questions"); 

    // vytvoř tabulku 
    db.run(
        `CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT, -- Primární klíč s automatickým inkrementem
            orderNumber INTEGER NOT NULL, -- Pořadové číslo otázky
            question TEXT NOT NULL, -- Text otázky
            options TEXT NOT NULL,  -- Možnosti odpovědí uložené jako JSON
            correctAnswer TEXT NOT NULL -- Správná odpověď
        )`,
        (err) => {
            if (err) {
                console.error("Error creating table:", err.message);
            } else {
                console.log("Table created (if it didn't already exist).");
            }
        }
    );

    // smaž data z tabulky
    db.run("DELETE FROM questions", (err) => {
        if (err) {
            console.error("Error deleting existing data:", err.message);
        } else {
            console.log("Old data cleared.");
        }
    });

    // vložit otázky do tabulky
    const stmt = db.prepare("INSERT INTO questions (orderNumber, question, options, correctAnswer) VALUES (?, ?, ?, ?)");
    questions.forEach((q) => {

        stmt.run(q.order, q.question, JSON.stringify(q.options), q.correctAnswer, (err) => {

            if (err) {
                console.error("Error inserting data:", err.message); 
            }

        });

    });

    // dokončení
    stmt.finalize(() => {
        console.log("Questions added to the database."); 
        db.close();
    });
});
