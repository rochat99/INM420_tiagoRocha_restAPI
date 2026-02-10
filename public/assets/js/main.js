const wordInput = document.getElementById("wordInput");
const submitBtn = document.getElementById("submitButton");
const errorMessageArea = document.getElementById("errorMessageArea");
const definitionArea = document.getElementById("definitionArea");
const synonymList = document.getElementById("synonymList");
const antonymList = document.getElementById("antonymList");

wordInput.addEventListener("keypress", function(e){

    const word = wordInput.value;
    let wordTrim = word.trim();

    if (e.key === "Enter") {

        getDefinition(wordTrim)

        wordInput.value = "";

    }

})

//button listener to search word
submitBtn.addEventListener("click", function() {

    const word = wordInput.value;
    let wordTrim = word.trim();

    if(wordTrim) {

        getDefinition(wordTrim);

    };

    wordInput.value = "";

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

    //check if typed word exists in dictionary if not, display error message
    if (dictionaryData.length === 0) {

        //clear all areas
        clearAllFields();

        //build HTML
        let notFound = document.createElement("h2");

        errorMessageArea.append(notFound);

        notFound.classList.add("notFound");

        notFound.innerHTML = `${word} not found in dictionary`;

    // else if typo is detected and near word is detected by api, create a 'did you mean' section
    } else if (typeof dictionaryData[0] === "string") {

        clearAllFields();

        let couldNotFind = document.createElement("h2");
        let didYouMean = document.createElement("h3");
        let ul = document.createElement("ul");

        couldNotFind.classList.add("couldNotFind");
        didYouMean.classList.add("didYouMean");

        couldNotFind.innerHTML = `Could not find ${word} in dictionary`;
        didYouMean.innerHTML = "Did you mean..."

        definitionArea.append(couldNotFind, didYouMean);
        errorMessageArea.append(ul);
        
        //loop through word suggestions and display them with links to words
        dictionaryData.forEach(word => {

            let li = document.createElement("li");
            let option = document.createElement("a");

            option.innerHTML = word;
            option.href = "#";

            ul.append(li);
            li.appendChild(option);

            option.addEventListener("click", function(e) {

                e.preventDefault();
                getDefinition(word);

            });

        })

    //otherwise get word and definition and display them
    } else if (dictionaryData[0].meta) {

        // clearAllFields();

        buildDefinition(dictionaryData[0].meta.hwi.hw, dictionaryData[0].meta.fl, dictionaryData[0].meta.shortdef[0]);

        if (thesaurusData[0] && typeof thesaurusData[0] === "object" && thesaurusData[0].meta) {

            //check if there are synonyms or antonyms in thesaurus. If true, display them else clear the list
            if (thesaurusData[0].meta.syns) {

                buildSynonyms(thesaurusData[0].meta.syns.flat());

            } else {

                synonymList.innerHTML = "";

            };

            if (thesaurusData[0].meta.ants) {

                buildAntonyms(thesaurusData[0].meta.ants.flat());

            } else {

                antonymList.innerHTML = "";

            };
            
        };

    };

};

//create HTML structure to display word, functional label and definition
function buildDefinition(word, fl, shortdef) {

    definitionArea.innerHTML = "";

    let wordTitle = document.createElement("h2");
    let functionalLabel = document.createElement("p");
    let definition = document.createElement("p");

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
    let ul = document.createElement("ul");

    synonymTitle.innerHTML = "Synonyms";

    synonymList.append(synonymTitle);
    synonymList.append(ul);

    synonymArray.forEach(syn => {
        
        let li = document.createElement("li");
        let synonym = document.createElement("a");

        synonym.href = "#";
        synonym.innerHTML = syn;

        ul.append(li);
        li.append(synonym);

        synonym.addEventListener("click", function(e) {

            e.preventDefault();
            getDefinition(syn);

        });
    });
};

//create list of antonyms with link to search up selected word
function buildAntonyms(antonymArray) {

    antonymList.innerHTML = "";

    let antonymTitle = document.createElement("h2");
    let ul = document.createElement("ul");

    antonymTitle.innerHTML = "Antonyms";

    antonymList.append(antonymTitle);
    antonymList.append(ul);
    
    antonymArray.forEach(ant => {
        
        let li = document.createElement("li");
        let antonym = document.createElement("a");
        antonym.href = "#";

        antonym.innerHTML = ant;

        ul.append(li);
        li.append(antonym);

        antonym.addEventListener("click", function(e) {

            e.preventDefault();
            getDefinition(ant);

        });
    });
};

function clearAllFields() {

    errorMessageArea.innerHTML = "";
    definitionArea.innerHTML = "";
    synonymList.innerHTML = "";
    antonymList.innerHTML = "";

};