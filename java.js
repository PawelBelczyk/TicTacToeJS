const Gameboard = (() => {
    
    const board = ["","","","","","","","",""];

    function getBoard() {
        return board;
    }


    function placeMark(index, mark) {
        board[index] = mark;
    }

return {
    getBoard,
    placeMark
};

})();





function Player(name, mark) {

    function getName() {
        return name;
    }

    return {
        name,
        mark
    };
}






