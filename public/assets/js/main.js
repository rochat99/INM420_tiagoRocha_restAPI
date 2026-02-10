const wordInput = document.getElementById("wordInput");
const submitBtn = document.getElementById("submitButton");
const definitionArea = document.getElementById("definitionArea");
const synonymList = document.getElementById("synonymList");
const antonymList = document.getElementById("antonymList");

//button listener to search word
submitBtn.addEventListener("click", function() {

    const word = wordInput.value.trim();

    if(word) {
        getDefinition(word);
    };

});

async function getDefinition(word) {

    const urlDictionary = `https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=103f26a7-bfb3-4869-8849-6d885a8b2deb`;
    const urlThesaurus = `https://dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=21091d59-99de-4126-a014-cfa406578abf`;

    const dictionaryResponse = await fetch(urlDictionary);
    const dictionaryData = await dictionaryResponse.json();
    console.log("json data from API", urlDictionary); 

    const thesaurusResponse = await fetch(urlThesaurus);
    const thesaurusData = await thesaurusResponse.json();
    console.log("json data from API", urlThesaurus); 

    //check if typed word exists in dictionary
    if (dictionaryData.length === 0) {

        //clear definition area
        definitionArea.innerHTML = "";

        //build HTML
        let notFound = document.createElement("h2");
        definitionArea.append(notFound);
        notFound.classList.add("notFound");
        notFound.innerHTML = `${word} not found in dictionary`;

    //if typo is detected and near word is detected by api, create a 'did you mean' section
    } else if (typeof dictionaryData[0] === "string") {

        definitionArea.innerHTML = "";

        let couldNotFind = document.createElement("h2");
        let didYouMean = document.createElement("h3");

        couldNotFind.classList.add("couldNotFind");
        didYouMean.classList.add("didYouMean");

        couldNotFind.innerHTML = `Could not find ${word} in dictionary`;
        didYouMean.innerHTML = "Did you mean..."

        definitionArea.append(couldNotFind, didYouMean);
        
        //typo pulls up an array, loop through array to display each option
        for (let i = 0; i < dictionaryData.length; i++) {

            let option = document.createElement("a");

            option.innerHTML = dictionaryData[i];

            definitionArea.append(option);

            option.href = `https://dictionaryapi.com/api/v3/references/collegiate/json/${dictionaryData[i]}?key=103f26a7-bfb3-4869-8849-6d885a8b2deb`

        }

    } else if (dictionaryData[0].meta) {

        buildDefinition(dictionaryData[0].meta.hwi.hw, dictionaryData[0].meta.fl, dictionaryData[0].meta.shortdef);

        if (thesaurusData[0].meta.syns) {
            buildSynonyms(thesaurusData[0].meta.syns.flat());
        };

        if (thesaurusData[0].meta.ants) {
            buildAntonyms(thesaurusData[0].meta.ants.flat());
        };

    };

};

function buildDefinition(word, fl, shortdef) {

    definitionArea.innerHTML = "";
    antonymList.innerHTML = "";

    let wordTitle = document.createElement("h2");
    let functionalLabel = document.createElement("p");
    let definition = document.createElement("p");

    let antonymTitle = document.createElement("h2");
    antonymTitle.innerHTML = "Antonyms"

    functionalLabel.classList.add("functionalLabel");

    wordTitle.innerHTML = word;
    functionalLabel.innerHTML = fl;
    definition.innerHTML = shortdef;

    definitionArea.append(wordTitle, functionalLabel, definition);

};

//create list of synonyms with links that will let user look up selected word
function buildSynonyms(synonymArray) {

    synonymList.innerHTML = "";

    let synonymTitle = document.createElement("h2");
    synonymTitle.innerHTML = "Synonyms";

    synonymList.append(synonymTitle);

    for (let i = 0; i < synonymArray.length; i++) {
        
        let synonym = document.createElement("a");

        synonym.innerHTML = synonymArray[i];

        synonym.href = `https://dictionaryapi.com/api/v3/references/collegiate/json/${synonymArray[i]}?key=103f26a7-bfb3-4869-8849-6d885a8b2deb`

    };

};

function buildAntonyms(antonymArray) {

    antonymList.innerHTML = '';

    let antonymTitle = document.createElement("h2");
    antonymTitle.innerHTML = "Antonyms";

    antonymList.append(antonymTitle);
    
    for (let i = 0; i < antonymArray.length; i++) {
        
        let antonym = document.createElement("a");

        antonym.innerHTML = antonymArray[i];

        antonym.href = `https://dictionaryapi.com/api/v3/references/collegiate/json/${antonymArray[i]}?key=103f26a7-bfb3-4869-8849-6d885a8b2deb`

    };

};