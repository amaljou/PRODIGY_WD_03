const cells = document.querySelectorAll('.cell');
const statusDisplay = document.querySelector('.game--status');
const restartButton = document.querySelector('.game--restart');
const playWithFriendButton = document.getElementById('playWithFriend');
const playWithAIButton = document.getElementById('playWithAI');
const gameModeButtons = document.querySelector('.game--mode');

let gameActive = false; 
let currentPlayer = "X"; 
let gameState = ["", "", "", "", "", "", "", "", ""];
let againstAI = false; 
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `It's a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;


statusDisplay.innerHTML = "";
playWithFriendButton.addEventListener('click', () => {
    againstAI = false;
    startGame();
});

playWithAIButton.addEventListener('click', () => {
    againstAI = true;
    startGame();
});

function startGame() {
    gameModeButtons.style.display = 'none'; 
    restartButton.style.display = 'none'; 
    statusDisplay.innerHTML = currentPlayerTurn(); 
    gameActive = true; 
    enableCellClicks(); 
}

function enableCellClicks() {
    cells.forEach(cell => cell.style.pointerEvents = 'auto'); 
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        restartButton.style.display = 'block'; 
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        restartButton.style.display = 'block'; 
        return;
    }

    handlePlayerChange();
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();

    if (gameActive && currentPlayer === "O" && againstAI) {
        setTimeout(handleAIMove, 500);
    }
}

function handleAIMove() {
    let availableCells = [];
    gameState.forEach((cell, index) => {
        if (cell === "") {
            availableCells.push(index);
        }
    });

    if (availableCells.length > 0) {
        const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        const cellToPlay = cells[randomIndex];
        handleCellPlayed(cellToPlay, randomIndex);
        handleResultValidation();
    }
}

function handleRestartGame() {
    gameActive = false; 
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = ""; 
    cells.forEach(cell => cell.innerHTML = "");
    cells.forEach(cell => cell.style.pointerEvents = 'none'); 
    restartButton.style.display = 'none'; 
    gameModeButtons.style.display = 'block'; 
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', handleRestartGame);
