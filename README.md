# SOC-GJPME Web App

Tento projekt je webová aplikace zaměřená na bezpečnost hesel. Obsahuje informace o heslech, generátor passphrase a kvíz pro testování znalostí o bezpečnosti hesel.

Webová aplikace je dostupná na: https://soc-gjpme-app-4acp.onrender.com

## Struktura projektu

- **`frontend/`** – Frontend postavený na Vite a Tailwind CSS
- **`backend/`** – Backend postavený na Node.js, Express a PostgreSQL

## Instalace a nastavení

### Požadavky
- PostgreSQL databáze

### Backend

1. Instalace dependencies:
   ```sh
   cd backend
   npm install
   ```
2. Konfigurace souboru `.env`
3. Spuštění backendu:
   ```sh
   npm run start
   ```

### Frontend

1. Instalace dependencies:
   ```sh
   cd frontend
   npm install
   ```
2. Postavení frontendu:
   ```sh
   npm run build
   ```


## Použité slovníky pro generátor passphrase


* [czech.txt](https://github.com/Tqqk/soc-gjpme-app/blob/main/frontend/public/wordlists/czech.txt) (18 325 slov)
    * **původní slovník** - *Wordlist českých slov (bez diakritiky)* [01-04-2025]
    \
    https://www.soom.cz/download/data/all_platforms/wordlists/czech.rar 
    \
    (162 147 slov)

&nbsp;

* [english.txt](https://github.com/Tqqk/soc-gjpme-app/blob/main/frontend/public/wordlists/english.txt) (18 325 slov)
    * **původní slovník** - *1Password English Wordlist* [01-04-2025]
    \
    https://github.com/1Password/spg/blob/master/testdata/agwordlist.txt 
    \
    (18 325 slov)
