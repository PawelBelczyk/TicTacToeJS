console.log("JS działa");

const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    function getBoard() {
        return board;
    }

    function placeMark(index, mark) {
        if (board[index] !== "") return false;
        board[index] = mark;
        return true;
    }

    function reset() {
        board = ["", "", "", "", "", "", "", "", ""];
    }

    return { getBoard, placeMark, reset };
})();

function Player(name, mark) {
    function getName() {
        return name;
    }

    return { getName, mark };
}

const GameController = (() => {
    const player1 = Player("Player1", "X");
    const player2 = Player("Player2", "O");

    let currentPlayer = player1;
    let gameOver = false;

    function switchPlayer() {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    }

    function getCurrentPlayer() {
        return currentPlayer;
    }

    function checkWinner(board) {
        const wins = [
            [0,1,2],[3,4,5],[6,7,8],
            [0,3,6],[1,4,7],[2,5,8],
            [0,4,8],[2,4,6]
        ];

        return wins.some(([a,b,c]) =>
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        );
    }

    function playRound(index) {
        if (gameOver) return;

        const mark = currentPlayer.mark;
        const success = Gameboard.placeMark(index, mark);

        if (!success) return;

        const board = Gameboard.getBoard();

        if (checkWinner(board)) {
            gameOver = true;
            ScreenController.showResult(`${currentPlayer.getName()} wygrał! 🎉`);
            return;
        }

        if (!board.includes("")) {
            gameOver = true;
            ScreenController.showResult("Remis 🤝");
            return;
        }

        switchPlayer();
    }

    function restart() {
        Gameboard.reset();
        currentPlayer = player1;
        gameOver = false;
        ScreenController.clearResult();
    }

    return { playRound, getCurrentPlayer, restart };
})();

const ScreenController = (() => {
    const boardDiv = document.querySelector("#board");
    const infoDiv = document.querySelector("#info");
    const resetBtn = document.querySelector("#reset");
    const resultDiv = document.querySelector("#result");

    function render() {
        const board = Gameboard.getBoard();
        boardDiv.innerHTML = "";

        board.forEach((cell, index) => {
            const button = document.createElement("button");
            button.classList.add("cell");
            button.textContent = cell;

            if (cell === "X") button.classList.add("player-x");
            if (cell === "O") button.classList.add("player-o");

            button.addEventListener("click", () => {
                GameController.playRound(index);
                updateScreen();
            });

            boardDiv.appendChild(button);
        });

        updateInfo();
    }

    function updateInfo() {
        const player = GameController.getCurrentPlayer();
        infoDiv.textContent = `Tura: ${player.mark}`;
    }

    function showResult(text) {
        resultDiv.textContent = text;
    }

    function clearResult() {
        resultDiv.textContent = "";
    }

    function updateScreen() {
        render();
    }

    resetBtn.addEventListener("click", () => {
        GameController.restart();
        updateScreen();
    });

    render();

    return { showResult, clearResult };
})();