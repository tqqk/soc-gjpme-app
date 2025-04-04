// knihovny 
require("dotenv").config();
const { Pool } = require("pg");

// připojení k databázi
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// otázky
const questions = [
    {
        orderNumber: 1,
        question: "Jaká je minimální doporučená délka silného hesla?",
        options: JSON.stringify(["6 znaků", "8 znaků", "12 znaků", "15 znaků"]),
        correctAnswer: "8 znaků",
    },
    {
        orderNumber: 2, 
        question: "Co je passphrase?",
        options: JSON.stringify(["Heslo obsahující osobní údaje", "Heslo tvořeno jedním slovem", "Heslo obsahující speciální znaky a čísla", "Heslo tvořené kombinací několika slov"]),
        correctAnswer: "Heslo tvořené kombinací několika slov",
    },
    {
        orderNumber: 3, 
        question: "Proč byste měli používat unikátní hesla pro každý účet?",
        options: JSON.stringify(["Zamezí to přístupu útočníka ke všem vašim účtům při úniku jednoho hesla", "Je to vyžadováno zákonem", "Usnadní to zapamatování hesel", "Zvyšuje to rychlost přihlašování"]),
        correctAnswer: "Zamezí to přístupu útočníka ke všem vašim účtům při úniku jednoho hesla",
    },
    {
        orderNumber: 4, 
        question: "Co je dvoufázové ověření?",
        options: JSON.stringify(["Způsob přihlášení bez použití hesla", "Kombinace hesla a dalšího ověřovacího faktoru (např. SMS kód nebo biometrie)", "Použití jednoho hesla pro jeden účet", "Technologie, která automaticky zamkne účet po třech neúspěšných pokusech o přihlášení."]),
        correctAnswer: "Kombinace hesla a dalšího ověřovacího faktoru (např. SMS kód nebo biometrie)",
    },
    {
        orderNumber: 5, 
        question: "Jakou hlavní výhodu přináší správce hesel?",
        options: JSON.stringify(["Ukládání všech vašich hesel na jednom místě v šifrované podobě", "Automatické sdílení hesel s vašimi kontakty", "Generování slabých hesel pro rychlé použití", "TUkládání hesel přímo do prohlížeče bez šifrování"]),
        correctAnswer: "Ukládání všech vašich hesel na jednom místě v šifrované podobě",
    },
    {
        orderNumber: 6, 
        question: "Na co bychom měli dbát při používání správce hesel?",
        options: JSON.stringify(["Používání krátkého hesla bez dvoufázového ověření", "Přihlašovat se na něj z cizích počítačů", "Používání velice silného hlavního hesla s dvoufázovým ověřením", "Zapsat si heslo na papírek vedle počítače v kanceláři"]),
        correctAnswer: "Používání velice silného hlavního hesla s dvoufázovým ověřením",
    },
    {
        orderNumber: 7, 
        question: "Proč byste neměli používat osobní údaje (jména, data narození apod.) jako součást svých hesel?",
        options: JSON.stringify(["Jsou povinné pouze u některých typů účtů", "Jsou snadno odhadnutelné útočníkem", "Snižují délku vašeho hesla", "Používání osobních údajů je trestně stíhané"]),
        correctAnswer: "Jsou snadno odhadnutelné útočníkem",
    }
];

// vytvoření table a vložení otázek
async function seedDatabase() {
    try {
        // smaž celou table s otazkami pokud již existuje
        await pool.query("DROP TABLE IF EXISTS questions");

        // vytvoř table
        await pool.query(`
            CREATE TABLE questions (
                id SERIAL PRIMARY KEY,
                orderNumber INTEGER NOT NULL,
                question TEXT NOT NULL,
                options JSONB NOT NULL,
                correctAnswer TEXT NOT NULL
            )`
        );
        console.log("Table vytvořena");

        // vložit otázky do table
        for (const question of questions) {
            await pool.query(
                "INSERT INTO questions (orderNumber, question, options, correctAnswer) VALUES ($1, $2, $3, $4)",
                [question.orderNumber, question.question, question.options, question.correctAnswer]
            );
        }
        console.log("Otázky vloženy do databáze");

    } catch (error) {

        console.error("Problém s vytvořením table a vložením otázek do databáze", error);

    } finally {

        pool.end();
    }
}

seedDatabase();