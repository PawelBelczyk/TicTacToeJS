
console.log("JS działa");

const Gameboard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];

    function getBoard() {
        return board;
    }

    function placeMark(index, mark) {
        if (board[index] !== "") return false;
        board[index] = mark;
        return true;
    }

    function reset() {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    }

    return {
        getBoard,
        placeMark,
        reset
    };
})();


function Player(name, mark) {

    function getName() {
        return name;
    }

    return {
        getName,
        mark
    };
}


const GameController = (() => {
    const player1 = Player("Paweł", "X");
    const player2 = Player("Anna", "O");

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

        return wins.some(([a, b, c]) => {
            return board[a] &&
                   board[a] === board[b] &&
                   board[a] === board[c];
        });
    }

    function playRound(index) {
        if (gameOver) return;

        const mark = currentPlayer.mark;

        const success = Gameboard.placeMark(index, mark);

        if (!success) {
            console.log("Zajęte pole, wybierz inne");
            return;
        }

        const board = Gameboard.getBoard();

        if (checkWinner(board)) {
            console.log(`${currentPlayer.getName()} wygrał!`);
            gameOver = true;
            return;
        }

        if (!board.includes("")) {
            console.log("Remis");
            gameOver = true;
            return;
        }

        switchPlayer();
    }

    function restart() {
        Gameboard.reset();
        currentPlayer = player1;
        gameOver = false;
    }

    return {
        playRound,
        getCurrentPlayer,
        restart
    };
})();

const ScreenController = (() => {
    const boardDiv = document.querySelector("#board");
    const infoDiv = document.querySelector("#info");
    const resetBtn = document.querySelector("#reset");

    function render() {
        const board = Gameboard.getBoard();
        boardDiv.innerHTML = "";

        board.forEach((cell, index) => {
            const button = document.createElement("button");
            button.classList.add("cell");
            button.textContent = cell;

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

    resetBtn.addEventListener("click", () => {
        GameController.restart();
        updateScreen();
    });

    function updateScreen() {
        render();
    }

    // START GRY
    render();

    return {};
})();


 