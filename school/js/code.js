document.addEventListener('DOMContentLoaded', () => {
    const gameText = document.getElementById('game-text');
    const choices = document.getElementById('choices');
    const titleDisplay = document.getElementById('title-display');
    let gameData = {};

    fetch('./js/gameData.json')
        .then(response => response.json())
        .then(data => {
            gameData = data;
            updateGame('start');
        });

    function createButton(choice, index) {
        const button = document.createElement('button');
        button.innerText = `${index + 1}) ${choice.text}`;
        button.className = 'bg-gray-900 text-white py-1 px-4 rounded w-4/5 text-start';
        button.addEventListener('click', () => {
            updateGame(choice.nextState);
        });
        return button;
    }

    function updateGame(state) {
        const currentState = gameData[state];
        titleDisplay.innerHTML = `<h2 class="inline-block px-4 text-2xl font-bold border-y">${currentState.title}</h2>`;
        gameText.innerText = currentState.text;
        choices.innerHTML = '';
        currentState.choices.forEach((choice, index) => {
            const button = createButton(choice, index);
            choices.appendChild(button);
        });
    }

    document.addEventListener('keydown', (event) => {
        const key = event.key;
        const currentState = gameData[document.querySelector('#title-display h2').innerText];
        if (key >= '1' && key <= currentState.choices.length.toString()) {
            const choiceIndex = parseInt(key, 10) - 1;
            updateGame(currentState.choices[choiceIndex].nextState);
        }
    });
});