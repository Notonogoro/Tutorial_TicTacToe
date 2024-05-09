import { useState, useEffect } from 'react';
import { registerToggleButton } from './Libraries/toggleButton.js';

function Square({ value, onSquareClick, className }) {
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}
function Board({ xIsNext, squares, onPlay }) {

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
          who: squares[a],
          pattern: lines[i]
        }
      }
    }
    if (squares.includes(null)) {
      return null;
    }
    else {
      return {
        who: null,
        pattern: null
      }
    }
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = winner.who ? "Winner: " + winner.who : "The match is Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function handleClick(i) {
    if (squares[i] || winner) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    // Why need to create new array ? it's called Immutability
    // Avoiding direct data mutation lets you keep previous versions of the data intact, and reuse them later.
    // Immutability makes performance very cheap for components to compare whether their data has changed or not.
    // to let React asume the state of the component has changed, need to copy the array first.
    onPlay(nextSquares);
  }

  function generateSquare(dimension) {
    let dimensionTranslate = [...Array(dimension).keys()];
    return (
      dimensionTranslate.map((row) => {
        return (<div key={row} className="board-row">
          {
            dimensionTranslate.map((column) => {
              const squareIndex = dimension * row + column;
              let className = winner && winner.who && winner.pattern.includes(squareIndex) ? "square-winner" : "square";
              return <Square key={squareIndex} value={squares[squareIndex]} onSquareClick={() => handleClick(squareIndex)} className={className} />
            })
          }
        </div>
        )
      })
    )
  }

  return (
    <>
      <div className="status">{status}</div>
      {generateSquare(3)}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscButton, setIsAscButton] = useState(true);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  useEffect(() => {
    registerToggleButton();
  }, []);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function calculateRowCol(dimension, index) {
    let column = 0;
    let row = 0;
    for (let x = 0; x < index; x++) {
      column++;
      if (column == dimension) {
        column = 0;
        row++;
      }
    }

    return {
      row: row,
      column: column
    }
  }

  const moves = (isAscButton ? [...Array(history.length).keys()] : [...Array(history.length).keys()].reverse()).map((historyIndex, loopIndex, arr) => {
    let description;
    let lastItem = historyIndex == arr.length - 1;
    if (lastItem) {
      description = 'You are at move #' + historyIndex;
    } else if (historyIndex > 0) {
      history[historyIndex].map((value, index) => {
        if (value !== history[historyIndex - 1][index]) {
          let diffPosition = calculateRowCol(3, index)
          description = 'Go to move #' + historyIndex + " Row:" + diffPosition.row + ", Column:" + diffPosition.column;
          return;
        }
      })
    } else {
      description = 'Go to game start';
    }


    return (
      <li key={historyIndex}>
        {lastItem ? <p>{description}</p> : <button onClick={() => setCurrentMove(historyIndex)}>{description}</button>}
      </li>
    )
  })



  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div className="btn-holder" onClick={() => setIsAscButton(!isAscButton)}>
          <div className="btn-circle"></div>
          <input type="checkbox" className="checkbox" ></input>
        </div>
        <ol>
          {moves}
        </ol>
      </div>
    </div>
  );
}
