// --- Helper Function to Create the Conjugation String ---
function createConjugationString(item, templateText, numberType) {

    // Pronoun Lookup Table based on item Type
    const pronounSets = {
        DEFAULT: {
            singular: ["I", "You (Singular)", "He/She/It"],
            plural: ["We", "You (Plural)", "They"]
        },
        DATIVE: {
            singular: ["Ինծի", "Քեզի", "Իրեն/Անոր"],
            plural: ["Մեզի", "Ձեզի", "Իրենց/Անոնց"]
        },
        ACCUSATIVE: {
            singular: ["Զիս", "Քեզ", "Զինք/Զայն"],
            plural: ["Մեզ", "Ձեզ", "Զիրենք/Զանոնք"]
        }
    };

    const typeKey = item.type.toUpperCase();
    const selectedSet = pronounSets[typeKey] || pronounSets.DEFAULT;

    const subjects = selectedSet[numberType];

    let sentences = [];

    // Loop through the selected subjects
    for (let i = 0; i < subjects.length; i++) {
        const subject = subjects[i];
        let fullSentence = "";

        // Construct the full sentence *including* the subject pronoun at the start
        if (templateText === "col2") {
            // Col 2 structure
            fullSentence = `${subject} ${item.first_person_present}`;
        } else { // col3
            // Col 3 structure
            fullSentence = `${subject} ${item.first_person_present}`;
        }
        sentences.push(fullSentence);
    }

    // Join the three sentences using an HTML line break (<br>)
    return sentences.join('<br>');
}

// --- 1. FILTER FUNCTION ---
function filterTable() {
    var input, filter, tableBody, tr, td, i, txtValue;

    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();

    tableBody = document.getElementById("myTableBody");
    tr = tableBody.getElementsByTagName("tr");

    // Loop through all table rows
    for (i = 0; i < tr.length; i++) {
        // Get the cell of the FIRST column (index 0)
        td = tr[i].getElementsByTagName("td")[0];

        if (td) {
            txtValue = td.textContent || td.innerText;

            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

// --- 2. DATA LOADING FUNCTION ---
async function loadDataAndBuildTable() {
    const tableBody = document.getElementById('myTableBody');
    const dataFile = 'configuration.yaml';

    try {
        // Fetch the YAML file
        const response = await fetch(dataFile);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const yamlText = await response.text();
        // NOTE: jsyaml library must be loaded BEFORE this script runs.
        const data = jsyaml.load(yamlText);
        let verbs = data.verbs;

        // Sort the data alphabetically based on 'name' (Column 1)
        verbs.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
        });

        tableBody.innerHTML = ''; // Clear the 'Loading...' message

        verbs.forEach(item => {
            const row = tableBody.insertRow();

            // Column 2 (Singular forms, Verb first template)
            const conjugationString_Col2 = createConjugationString(item, "col2", "singular");

            // Column 3 (Plural forms, Object first template)
            const conjugationString_Col3 = createConjugationString(item, "col3", "plural");

            // Column 1: The searchable name
            row.insertCell().textContent = item.name;

            // Column 2: Insert the singular conjugation string using .innerHTML
            row.insertCell().innerHTML = conjugationString_Col2;

            // Column 3: Insert the plural conjugation string using .innerHTML
            row.insertCell().innerHTML = conjugationString_Col3;
        });

    } catch (error) {
        console.error('Error loading or parsing YAML:', error);
        tableBody.innerHTML = `<tr><td colspan="3" style="color: red;">Error loading data: ${error.message}</td></tr>`;
    }
}

// Execute the function when the page loads
loadDataAndBuildTable();