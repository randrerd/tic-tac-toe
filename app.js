const gameBoard = (() => {
  const boardArray = new Array(9).fill(" ");

  const updateSquares = () => {
    console.log(boardArray);
    boardArray.forEach((square, i) => {
      const currentRenderedSquare = document.querySelector(
        `span[data-key='${i}']`
      );
      const renderedSquareValue = currentRenderedSquare.innerText;
      renderedSquareValue !== square
        ? (currentRenderedSquare.innerText = square)
        : null;
    });
  };

  const getBoard = () => boardArray;

  return { getBoard, updateSquares };
})();

const game = (() => {
  const boardArray = gameBoard.getBoard();

  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let isGameFinished = false;

  const Player = (name) => {
    const mark = name;

    const addMark = (target) => {
      const key = target.attributes["data-key"].value;

      const isSquareAvailable = target.innerText === "" ? true : false;

      if (isSquareAvailable) {
        //Updates board array and then renders updated board
        boardArray[key] = mark;
        gameBoard.updateSquares();
        //Sets the other player

        checkWin(winCombos, mark);

        currentPlayer = currentPlayer !== playerTwo ? playerTwo : playerOne;
      }
    };

    return { addMark };
  };

  const playerOne = Player("X");
  const playerTwo = Player("O");
  let currentPlayer = playerOne;

  const init = () => {
    boardArray.fill(" ");
    isGameFinished = false;

    gameBoard.updateSquares();
    displayController.renderHeader();
  };

  const checkWin = (arr, player) => {
    let j = 0;
    arr.forEach((subArr) => {
      let i = 0;

      subArr.forEach((elem) => {
        //Adds to counter if user added mark to one of the possible
        //winning squares
        if (boardArray[elem] === player) {
          i++;
          //If player has 3 winning marks, then they won
          if (i === 3) {
            displayController.renderHeader(player);
            isGameFinished = true;
          }
        }
      });
    });

    boardArray.forEach((square) => {
      console.log({ square, j });
      //Adds to counter if square not empty
      if (square !== " ") {
        j++;
        //Ties the game if every square filled
        if (j === 9 && !isGameFinished) {
          isGameFinished = true;
          displayController.renderHeader("La Vieja");
        }
      }
    });
  };
  const getCurrentPlayer = () => currentPlayer;
  const getGameStatus = () => isGameFinished;

  return { getGameStatus, checkWin, getCurrentPlayer, init };
})();

const displayController = (() => {
  const boardElement = document.querySelector(".board");
  const resetBtn = document.querySelector("#reset-button");

  //Renders square on first load
  const renderSquares = (() => {
    const boardArray = gameBoard.getBoard();
    boardArray.forEach((square, i) => {
      const squareElement = document.createElement("span");
      squareElement.innerHTML = square;
      squareElement.className = "board__square";
      squareElement.setAttribute("data-key", i);
      boardElement.appendChild(squareElement);
    });
  })();

  //Event listeners
  boardElement.addEventListener("click", (event) => boardClickHandler(event));
  resetBtn.addEventListener("click", () => resetBtnHandler());

  const boardClickHandler = (event) => {
    const currentPlayer = game.getCurrentPlayer();
    const isGameFinished = game.getGameStatus();
    if (!isGameFinished) {
      currentPlayer.addMark(event.target);
    }
  };
  const resetBtnHandler = () => {
    game.init();
  };

  const renderHeader = (result = null) => {
    const winnerElement = document.querySelector(".board__header");
    if (result) {
      winnerElement.innerText = `The winner is ${result}`;
    } else {
      winnerElement.innerText = `La vieja`;
    }
  };

  return { renderHeader };
})();
