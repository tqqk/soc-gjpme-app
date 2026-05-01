// pole se slovy
let wordLists =  {
    czech: [],
    english: []
};

// funkce pro načtení jazyka
async function loadWords(language) {
    const filePath = `wordlists/${language}.txt`;
    const response = await fetch(filePath);
    const text = await response.text();

    wordLists[language] = text.split('\n').map(word => word.trim()).filter(word => word.length > 0);
}

// funkce pro načtení slovníků
async function loadInitialWordLists() {

    if (document.getElementById("czech").checked) await loadWords('czech');
    if (document.getElementById("english").checked) await loadWords('english');
}

// interakce s html elementy
document.addEventListener('DOMContentLoaded', () => {	
    loadInitialWordLists();

    document.getElementById("czech").addEventListener("change", function() { 
        if (this.checked && wordLists.czech.length === 0) loadWords('czech');
    });

    document.getElementById("english").addEventListener("change", function() {
        if (this.checked && wordLists.english.length === 0) loadWords('english'); 
    });

    document.getElementById("generate").addEventListener("click", generatePassphrase);
    document.getElementById("copyPassphrase").addEventListener("click", copyToClipboard);
});

// funkce pro kopírování do schránky
function copyToClipboard() {
    const passphrase = document.getElementById("generatedPassphrase").textContent;

    navigator.clipboard.writeText(passphrase).then(() => {

        const copyButton = document.getElementById("copyPassphrase");
        copyButton.textContent = "Zkopírováno!";
        setTimeout(() => {
            copyButton.textContent = "Zkopírovat do schránky";
        }, 1500);

    });
}

// funkce pro validaci vstupu pro délku passphrase
function validateNumberOfWords(input) {
    const min = parseInt(input.min);
    const max = parseInt(input.max);
    let value = parseInt(input.value);

    if (value < min) value = min; 
    else if (value > max) value = max; 

    input.value = value; 
    return value;
}

// kryptograficky bezpecne nahodne cislo v rozsahu <0, maxExclusive)
function getSecureRandomInt(maxExclusive) {
    const random = new Uint32Array(1);
    const limit = Math.floor(0x100000000 / maxExclusive) * maxExclusive;

    let value;
    do {
        crypto.getRandomValues(random);
        value = random[0];
    } while (value >= limit);

    return value % maxExclusive;
}

// získání náhodného slova z kombinovaného wordlistu 
function getRandomWord(combinedWordList, capitalize) { 
    const randomIndex = getSecureRandomInt(combinedWordList.length);
    let randomWord = combinedWordList[randomIndex];

    if (capitalize) randomWord = randomWord.charAt(0).toUpperCase() + randomWord.slice(1);

    return randomWord;
}

// generovaní passphrase
function generatePassphrase() {

    let combinedWordList = [];
    if (document.getElementById("czech").checked) combinedWordList.push(...wordLists.czech);
    if (document.getElementById("english").checked) combinedWordList.push(...wordLists.english);
    
    if  (combinedWordList.length === 0) {
        document.getElementById("generatedPassphrase").textContent = "Vyberte alespoň jeden jazyk pro generování passphrase!";
        document.getElementById("passphraseOutput").classList.add(
        "bg-red-100", 
        );
        document.getElementById("copyPassphrase").classList.add("hidden");
        return;
    }

    const numberOfWords = validateNumberOfWords(document.getElementById("numberOfWords"));
    const capitalize = document.getElementById("capitalize").checked;

    const addNumberPosition = getSecureRandomInt(numberOfWords);
    const addNumber = document.getElementById("add-number").checked;
    const separator = document.getElementById("separator").value;

    let passphraseWords = [];
    for (let i = 0; i < numberOfWords; i++) {

        passphraseWords.push(getRandomWord(combinedWordList, capitalize));

        if (addNumber && i === addNumberPosition) {
            passphraseWords.push(getSecureRandomInt(10));
        }

        if (i < numberOfWords - 1) {
            passphraseWords.push(separator);
        }
    }

    let passphrase = passphraseWords.join("");
 
    document.getElementById("generatedPassphrase").textContent = passphrase;
    document.getElementById("passphraseOutput").classList.remove(
        "bg-red-100", 
    );
    document.getElementById("passphraseOutput").classList.add(
        "bg-gray-200", 
    );

    // zobrazit tlačítko pro kopírování passphrase
   document.getElementById("copyPassphrase").classList.remove("hidden");
}