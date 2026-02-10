const urlDictionary = 'https://dictionaryapi.com/api/v3/references/collegiate/json/test?key=103f26a7-bfb3-4869-8849-6d885a8b2deb';

const wordInput = document.getElementById("wordInput");
const submitBtn = document.getElementById("submitButton");
const definitionArea = document.getElementById("definitionArea");
const synonymList = document.getElementById("synonymList");
const antonymList = document.getElementById("antonymList");

submitBtn.addEventListener("click", function() {
    const word = wordInput.ariaValueMax.trim();
    if(word) {
        getDefinition(word);
    };
});

async function getDefinition(word) {

    const urlDictionary = `https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=103f26a7-bfb3-4869-8849-6d885a8b2deb`

    const response = await fetch(urlDictionary);
    const data = await response.json();
    console.log("json data from API", urlDictionary) 

    console.log(data)
};