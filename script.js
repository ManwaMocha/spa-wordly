document.addEventListener("DOMContentLoaded", function () {
  // Get elements from the HTML page
  const form = document.getElementById("searchForm");
  const input = document.getElementById("wordInput");
  const result = document.getElementById("result");
  const savedList = document.getElementById("savedWords");

  // Array to store saved words
  let savedWords = [];

  // EVENT LISTENER

  form.addEventListener("submit", function (e) {
    // Prevent the page from refreshing
    e.preventDefault();

    // Get the word entered by the user
    const word = input.value.trim();

    // If the input is empty, stop the function
    if (word === "") {
      alert("Please enter a word.");
      return;
    }

    // Call the function to fetch data from the API
    fetchWord(word);
  });

  // FETCH WORD FUNCTION
  // Gets data from the Free Dictionary API
  async function fetchWord(word) {
    try {
      // Send a request to the API
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      );

      // If the response is not successful
      if (!response.ok) {
        throw new Error("Word not found.");
      }

      const data = await response.json();

      // Display the first object returned by the API
      displayWord(data[0]);
    } catch (error) {
      // Display an error message if something goes wrong
      result.innerHTML = `
            <p style="color:red;">
                ${error.message}
            </p>
        `;
    }
  }

  // DISPLAY WORD FUNCTION
  // Shows the word information on the page

  function displayWord(data) {
    // Get the first meaning
    const meaning = data.meanings[0];

    // Get the first definition
    const definition = meaning.definitions[0];

    // Find the pronunciation audio
    const audio = data.phonetics.find(function (item) {
      return item.audio !== "";
    });

    // Display the information
    result.innerHTML = `

        <div class="card" id="wordCard">

            <h2>${data.word}</h2>

            <h3>${data.phonetic || "No pronunciation available"}</h3>

            <p>
                <strong>Part of Speech:</strong>
                ${meaning.partOfSpeech}
            </p>

            <p>
                <strong>Definition:</strong>
                ${definition.definition}
            </p>

            <p>
                <strong>Example:</strong>
                ${definition.example || "No example available"}
            </p>

            <p>
                <strong>Synonyms:</strong>
                ${
                  definition.synonyms.length > 0
                    ? definition.synonyms.join(", ")
                    : "None"
                }
            </p>

            ${
              audio
                ? `<audio controls src="${audio.audio}"></audio>`
                : "<p>No audio available.</p>"
            }

            <br><br>

            <button id="saveBtn">
                Save Word
            </button>

        </div>

    `;

    // Add an event listener to the Save button
    document.getElementById("saveBtn").addEventListener("click", function () {
      // Save the current word
      saveWord(data.word);
    });
  }

  // SAVE WORD FUNCTION
  // Adds a word to the saved list
  function saveWord(word) {
    // Check if the word is already saved
    if (savedWords.includes(word)) {
      alert("Word already saved.");
      return;
    }

    // Add the word to the array
    savedWords.push(word);

    // Display the updated saved words list
    displaySavedWords();

    // Change the card border to green
    document.getElementById("wordCard").classList.add("saved");
  }

  // DISPLAY SAVED WORDS FUNCTION
  // Shows all saved words on the page

  function displaySavedWords() {
    // Clear the old list before displaying it again
    savedList.innerHTML = "";

    // Loop through every saved word
    savedWords.forEach(function (word) {
      // Create a new list item
      const li = document.createElement("li");

      // Put the word inside the list item
      li.textContent = word;

      // Add the list item to the page
      savedList.appendChild(li);
    });
  }
});
