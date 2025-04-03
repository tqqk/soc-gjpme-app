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

    if (document.getElementById("czech").checked) {
        await loadWords('czech');
    }

    if (document.getElementById("english").checked) {
        await loadWords('english');
    }
}

// interakce s html elementy
document.addEventListener('DOMContentLoaded', () => {	
    loadInitialWordLists();

    document.getElementById("czech").addEventListener("change", function() { 
        if (this.checked && wordLists.czech.length === 0) {
            loadWords('czech');
        }
    });

    document.getElementById("english").addEventListener("change", function() {
        if (this.checked && wordLists.english.length === 0) {
            loadWords('english');
        }
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

    if (value < min) {
        value = min; 
    } else if (value > max) {
        value = max; 
    }

    input.value = value; 
    return value;
}

// generovaní passphrase
function generatePassphrase() {

    const useCzech = document.getElementById("czech").checked;
    const useEnglish = document.getElementById("english").checked;
    
    let combinedWordList = [];
    if (useCzech == true) combinedWordList = combinedWordList.concat(wordLists.czech);
    if (useEnglish == true) combinedWordList = combinedWordList.concat(wordLists.english);
    
    const numberOfWords = validateNumberOfWords(document.getElementById("numberOfWords"));
    const separator = document.getElementById("separator").value;
    
    const randomWords = [];
    for (let i = 0; i < numberOfWords; i++) {
        const randomIndex = Math.floor(Math.random() * combinedWordList.length);

        randomWords[i] = combinedWordList[randomIndex];
        
        if (document.getElementById("capitalize").checked) {
            randomWords[i] = randomWords[i].charAt(0).toUpperCase() + randomWords[i].slice(1);
        }
    }
    
    const randomNumber = Math.floor(Math.random() * randomWords.length);

    let passphrase = "";
    for (let i = 0; i < randomWords.length; i++) {

        if (i < randomWords.length - 1) {
            if (document.getElementById("add-number").checked && i == randomNumber) {
                passphrase = passphrase + randomWords[i] + Math.floor(Math.random() * 10) + separator; 
            }
            else {
                passphrase = passphrase + randomWords[i] + separator;
            }
        }
        else {
            if (document.getElementById("add-number").checked && i == randomNumber) {
                passphrase = passphrase + randomWords[i] + Math.floor(Math.random() * 10);      
            }
            else {
                passphrase = passphrase + randomWords[i];
            }
        }

    }
 
    const passphraseElement = document.getElementById("generatedPassphrase");
    passphraseElement.textContent = passphrase;
    passphraseElement.classList.add("bg-gray-200");

    document.getElementById("passphraseOutput").classList.add(
        "bg-gray-200",
        "border-0",
        "border-black",
    );

    // tlačítko pro kopírování passphrase
    const copyButton = document.getElementById("copyPassphrase");
    copyButton.classList.remove("hidden");

}