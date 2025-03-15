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

});

// generovaní passphrase
function generatePassphrase() {

    const useCzech = document.getElementById("czech").checked;
    const useEnglish = document.getElementById("english").checked;
    
    let combinedWordList = [];
    if (useCzech == true) combinedWordList = combinedWordList.concat(wordLists.czech);
    if (useEnglish == true) combinedWordList = combinedWordList.concat(wordLists.english);
    console.log(combinedWordList);
    
    const numberOfWords = parseInt(document.getElementById("numberOfWords").value);
    const separator = document.getElementById("separator").value;
    
    const randomWords = [];
    for (let i = 0; i < numberOfWords; i++) {
        const randomIndex = Math.floor(Math.random() * combinedWordList.length);
        console.log("random číslo " + randomIndex);

        randomWords[i] = combinedWordList[randomIndex];
    }
    
    let passphrase = "";
    for (let i = 0; i < randomWords.length; i++) {

        if (i < randomWords.length - 1) {
            passphrase = passphrase + randomWords[i] + separator;
        }
        else {
            passphrase = passphrase + randomWords[i];
        }
        
    }
 
    document.getElementById("generatedPassphrase").textContent = passphrase;
    
}