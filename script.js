async function getTotalPokemons() {
    const pokeApiURL = 'https://pokeapi.co/api/v2/pokemon-species/';
    try{
        const response = await fetch(pokeApiURL)
        if(!response.ok){
            throw new Error('Erro ao obter os dados da API')
        }
        const data = await response.json()
    return data.count
    }catch (error){
        console.log('Erro ao obter os dados da API', error)
    }
   

    // return fetch(pokeApiURL)
    //     .then(response => {
    //         if (response.ok) {
    //             return response.json();
    //         } else {
    //             throw new Error('Erro ao obter os dados da API');
    //         }
    //     })
    //     .then(data => {
    //         return data.count
    //     });
}

async function getRandomPokemon() {
    try{
        const totalCount = await getTotalPokemons();
        const randomIndex = Math.floor(Math.random() * totalCount) + 1;
        await getPokeId(randomIndex)
    }catch (error) {
        console.log("Erro ao obter total de pokémons", error);
    }
}

async function getPokeId(pokeId) {
    const  pokeIdUrl = `https://pokeapi.co/api/v2/pokemon/${pokeId}`;

    try {
        const response = await fetch(pokeIdUrl);
        if (!response.ok) {
            throw new Error('Não foi possível obter o ID do pokemon');
        }
        const data = await response.json();
        let urlimagePokemon = data.sprites.versions['generation-v']['black-white'].animated.front_default;
        if(urlimagePokemon == null){
             urlimagePokemon = data.sprites.front_default;
        }
        console.log(urlimagePokemon);
        let randomPokemon = data.name;
        console.log(data);
        const pokemonImage = document.querySelector("#image-pokemon");
        const letterInput = document.querySelector("#input");
        const wordDisplay = document.querySelector(".word");
        const guessButton = document.querySelector(".verify-button");
        const remainingChancesDisplay = document.querySelector("#chance");
        const guessedLettersDisplay = document.querySelector("#lettersTyped");
        const alertMessage = document.querySelector("#alert");
        const guessedWordsDisplay = document.querySelector("#wordsTyped");
        pokemonImage.src = urlimagePokemon

        let hiddenWord = "_".repeat(randomPokemon.length);
        wordDisplay.innerHTML = hiddenWord;
        let remainingChances = 6;
        remainingChancesDisplay.innerHTML = remainingChances;

        console.log(randomPokemon)
        let guessedLetters = [];
        let guessedWords = [];

        function addWord(word) {
            if (!guessedWords.includes(word)) {
                guessedWords.push(word);
                guessedWordsDisplay.innerHTML = guessedWords.join(", ").toLocaleUpperCase();
                decreaseChances(2);
                letterInputValue = "";
            } else {
                console.log(`A palavra "${word}" já foi tentada.`);
            }
            letterInput.value = "";
        }

        function addLetter(letter) {
            let isNewLetter = true;
            for (let i = 0; i < guessedLetters.length; i++) {
                if (guessedLetters[i] === letter) {
                    isNewLetter = false;
                }
            }
            if (!guessedLetters.includes(letter) && isNewLetter) {
                guessedLetters.push(letter);
                guessedLettersDisplay.innerHTML = guessedLetters.join(", ").toUpperCase();
            } else {
                alertMessage.innerHTML = "Você já tentou essa letra";
            }
        }

        letterInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                verifyLetter(randomPokemon);
            }
        });

        function verifyLetter(randomPokemon) {
            let letterInputValue = letterInput.value.toLowerCase();
            let letterAmount = letterInputValue.length;
            const specialCharacters = "!@#$%^&*()_-+={}[]|:;'<>,.?/~`\\";
            const num = "0123456789";
            let containsNumbers = num.includes(letterInputValue);
            let containsSpecialCharacter = specialCharacters.includes(letterInputValue);

            if (letterInputValue.trim() !== "") {
                if (containsSpecialCharacter || containsNumbers) {
                    alertMessage.innerHTML = "Contém caractere especial ou número";
                    letterInput.value = "";
                } else {
                    alertMessage.innerHTML = "";
                    letterInput.value = "";
                    if (letterAmount === 1) {
                        if (randomPokemon.includes(letterInputValue)) {
                            let modifiedString = "";
                            for (let i = 0; i < randomPokemon.length; i++) {
                                modifiedString += (randomPokemon[i] === letterInputValue) ? letterInputValue : hiddenWord[i];
                            }
                            wordDisplay.innerHTML = modifiedString.toLocaleUpperCase();
                            hiddenWord = modifiedString;
                            if (hiddenWord === randomPokemon) {
                                letterInput.readOnly = true;
                                alertMessage.innerHTML = "Você acertou";
                            }
                            addLetter(letterInputValue);
                        } else if (!randomPokemon.includes(letterInputValue) && guessedLetters.indexOf(letterInputValue) === -1) {
                            alertMessage.innerHTML = "Errou";
                            addLetter(letterInputValue);
                            decreaseChances(1);
                        }
                    } else if (letterAmount > 1) {
                        if (letterInputValue === randomPokemon) {
                            letterInput.readOnly = true;
                            alertMessage.innerHTML = "Você acertou!";
                            wordDisplay.innerHTML = randomPokemon.toLocaleUpperCase()
                        } else if (letterInputValue !== randomPokemon) {
                            addWord(letterInputValue);
                            alertMessage.innerHTML = "Palavra errada!";
                        }
                    }
                }
            } else {
                console.log("Nada digitado");
            }
        }

        guessButton.onclick = function() {
            verifyLetter(randomPokemon);
        };

        function decreaseChances(n) {
            remainingChances -= n;
            remainingChancesDisplay.innerHTML = remainingChances;
            letterInput.value = "";
            if (remainingChances <= 0) {
                letterInput.readOnly = true;
                remainingChancesDisplay.innerHTML = "0";
                alertMessage.innerHTML = "Você perdeu!";
                wordDisplay.innerHTML = randomPokemon.toLocaleUpperCase();
            }
        }
        letterInput.value = "";
        }catch (error) {
            console.log("Erro ao recuperar dados da API", error);
        }
}

getRandomPokemon();
