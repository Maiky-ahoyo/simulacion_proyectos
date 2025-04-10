let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];
let symbols = {
    'X': 'url("./img/x1.png")',
    'O': 'url("./img/o1.png")'
};
let boardColors = {
    color1: '#FEFEFE',
    color2: '#FEFEFE'
};
let highlight = '#2ECC71';
let time = 180;
let timerInterval;

const display = document.querySelector('#timer');
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
    [0, 4, 8], [2, 4, 6] // Diagonales
];

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.cell').forEach((cell, index) => {
        cell.addEventListener('click', () => handleCellClick(index));
    });

    document.getElementById('highlight').addEventListener('input', (e) => {
        highlight = e.target.value;
    });

    updateBoardColors();
    startTimer(time, display);
});

function handleCellClick(index) {
    if (!gameActive || gameState[index] !== '') return;

    gameState[index] = currentPlayer;
    const cell = document.getElementById(`cell${index}`);
    cell.style.backgroundImage = symbols[currentPlayer];
    
    const result = checkWin();
    if (result.winner) {
        highlightWinningCombination(result.combination);
        clearInterval(timerInterval);
        gameActive = false;
        updateBoardColors();
        document.getElementById('status').textContent = `¡${currentPlayer} Wins!`;
        return;
    }
    
    if (checkDraw()) {
        document.getElementById('status').textContent = "Draw!";
        gameActive = false;
        return;
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('current-turn').textContent = currentPlayer;
}

function checkWin() {
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameState[a] && 
            gameState[a] === gameState[b] && 
            gameState[a] === gameState[c]) {
            return { winner: gameState[a], combination };
        }
    }
    return { winner: null, combination: null };
}

function highlightWinningCombination(combination) {
    combination.forEach(index => {
        const cell = document.getElementById(`cell${index}`);
        cell.style.setProperty('--highlight-color', highlight);
        cell.classList.add('winning-line');
        cell.style.boxShadow = `0 0 15px ${highlight}`;
    });
}

function updateHighlightColor() {
    highlight = document.getElementById('highlight').value;
    document.querySelectorAll('.cell').forEach(cell => {
        cell.style.setProperty('--highlight-color', highlight);
    });
}

function checkDraw() {
    return gameState.every(cell => cell !== '');
}

function resetGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    
    document.querySelectorAll('.cell').forEach(cell => {
        cell.style.backgroundImage = '';
        cell.classList.remove('winning-line');
        cell.style.boxShadow = '';
    });
    
    document.getElementById('status').textContent = 'Playing...';
    document.getElementById('current-turn').textContent = 'X';
    updateBoardColors();
    startTimer(time, display);
}

function updateBoardColors() {
    if (!gameActive) {
        boardColors.color1 = '#9A9A98';
        boardColors.color2 = '#9A9A98';
    } else {
        boardColors.color1 = document.getElementById('color1').value;
        boardColors.color2 = document.getElementById('color2').value;
    }
    
    document.querySelectorAll('.cell').forEach((cell, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        cell.style.backgroundColor = (row + col) % 2 === 0 
            ? boardColors.color1 
            : boardColors.color2;
    });
}

function selectSymbol(player, imagePath) {
    const upperPlayer = player.toUpperCase();
    symbols[upperPlayer] = `url("${imagePath}")`;
    
    document.querySelectorAll('.cell').forEach((cell, index) => {
        if (gameState[index] === upperPlayer) {
            cell.style.backgroundImage = symbols[upperPlayer];
        }
    });
}

function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(timerInterval);
            document.getElementById('status').textContent = "Time's Up!";
            gameActive = false;
            updateBoardColors();
        }
    }, 1000);
}