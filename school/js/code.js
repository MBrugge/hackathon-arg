document.addEventListener('DOMContentLoaded', () => {
    const gameText = document.getElementById('game-text');
    const choices = document.getElementById('choices');
    const titleDisplay = document.getElementById('title-display');
    let gameData = {};
    let currentState = 'start';
    const secretCode = '1731'; 
    const computerCode = '120589';

    fetch('./js/gameData.json')
        .then(response => response.json())
        .then(data => {
            gameData = data;
            updateGame(currentState);
        });

    function createButton(choice, index) {
        const button = document.createElement('button');
        button.innerText = `${index + 1}) ${choice.text}`;
        button.className = 'bg-gray-900 text-white py-1 px-4 rounded w-full text-start';
        button.addEventListener('click', () => {
            if (choice.action === 'redirect') {
                window.location.href = '../index.html';
            } else if (choice.requiresCode) {
                promptForCode(choice.nextState, choice.codeType);
            } else {
                updateGame(choice.nextState);
            }
        });
        return button;
    }

    function promptForCode(nextState, codeType) {
        const codeInput = document.createElement('input');
        codeInput.type = 'text';
        codeInput.placeholder = 'Enter code';
        codeInput.className = 'bg-gray-700 text-white py-1 px-4 rounded w-full text-start mb-2';

        const submitButton = document.createElement('button');
        submitButton.innerText = 'Submit';
        submitButton.className = 'bg-gray-900 text-white py-1 px-4 rounded w-full text-start';
        submitButton.addEventListener('click', () => {
            let correctCode = false;
            if (codeType === 'computer') {
                correctCode = codeInput.value === computerCode;
            } else {
                correctCode = codeInput.value === secretCode;
            }

            if (correctCode) {
                updateGame(nextState);
                document.addEventListener('keydown', handleKeydown);
            } else {
                alert('Incorrect code. Try again.');
            }
        });

        choices.innerHTML = '';
        choices.appendChild(codeInput);
        choices.appendChild(submitButton);

        document.removeEventListener('keydown', handleKeydown);
    }

    function updateGame(state) {
        currentState = state;
        const stateData = gameData[state];
        titleDisplay.innerHTML = `<h2 class="inline-block px-4 text-2xl font-bold border-y">${stateData.title}</h2>`;
        gameText.innerText = stateData.text;
        choices.innerHTML = '';
        stateData.choices.forEach((choice, index) => {
            const button = createButton(choice, index);
            choices.appendChild(button);
        });
    }

    function handleKeydown(event) {
        const key = event.key;
        const stateData = gameData[currentState];
        if (key >= '1' && key <= stateData.choices.length.toString()) {
            const choiceIndex = parseInt(key, 10) - 1;
            const choice = stateData.choices[choiceIndex];
            if (choice.requiresCode) {
                promptForCode(choice.nextState, choice.codeType);
            } else {
                updateGame(choice.nextState);
            }
        }
    }

    document.addEventListener('keydown', handleKeydown);
});