document.addEventListener('DOMContentLoaded', () => {
    const gameText = document.getElementById('game-text');
    const choices = document.getElementById('choices');
    const choiceDisplay = document.createElement('div');
    choiceDisplay.id = 'choice-display';
    choiceDisplay.className = 'text-center text-white';
    gameText.parentNode.insertBefore(choiceDisplay, gameText);
    let gameData = {};

    fetch('./js/gameData.json')
        .then(response => response.json())
        .then(data => {
            gameData = data;
            updateGame('start');
        });

    function createButton(choice) {
        const button = document.createElement('button');
        button.innerText = choice.text;
        button.className = 'bg-blue-500 text-white py-1 px-4 rounded';
        button.addEventListener('click', () => {
            updateGame(choice.nextState);
        });
        return button;
    }

    function updateGame(state) {
        const currentState = gameData[state];
        choiceDisplay.innerHTML = `<h2 class="inline-block px-4 text-2xl font-bold border-y">${currentState.title}</h2>`;
        gameText.innerText = currentState.text;
        choices.innerHTML = '';
        currentState.choices.forEach(choice => {
            const button = createButton(choice);
            choices.appendChild(button);
        });
    }
});