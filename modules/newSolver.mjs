import { BOARD_TYPE } from '../env.mjs';
import { NO_PIECE } from './pieces.mjs';
import { useBoard } from './board.mjs';
import { generateAllPiecePositions, deadAreaOnBoard, countEmptySquares } from './boardTools.mjs';
import { NewDance } from './NewDance.mjs';
import {
  convertFromBoardPositionToDance,
  convertFromDanceToBoardPosition,
  phantomPiecesOnBoard,
  isUniqueSolution
} from './solverTools.mjs';

const { EMPTY_BOARD, pieceKeys } = useBoard(BOARD_TYPE || 'testing');

const cbIsValidBoard = solution => {
  const deadArea = deadAreaOnBoard(convertFromDanceToBoardPosition(solution));
  const ghostPieces = phantomPiecesOnBoard(convertFromDanceToBoardPosition(solution));
  return !deadArea && !ghostPieces;
};

const cbIsSolvedAlready = solution => {
  return countEmptySquares(convertFromDanceToBoardPosition(solution)) === 0;
};

const prepareDataStructure = () => {
  const usedPieces = new Set();
  const dance = new NewDance()

  // Collect all pieces used on board into usedPieces
  pieceKeys.forEach(pKey => {
    const pPositions = generateAllPiecePositions(EMPTY_BOARD, pKey);
    Object.keys(pPositions).forEach(posKey => {
      if (pPositions[posKey].length > 0) usedPieces.add(pKey);
    });
  });

  // Create columns for the used pieces
  Array.from(usedPieces).forEach(pKey => dance.addColumn(pKey));

  // Create columns for all the board positions
  EMPTY_BOARD.forEach((row, y) => {
    row.forEach((_, x) => {
      if (EMPTY_BOARD[y][x] === NO_PIECE) {
        dance.addColumn(`${x},${y}`);
      }
    });
  });

  // Add all the possible positions for pieces as rows
  let x = 0;
  pieceKeys.forEach(pKey => {
    const pPositions = generateAllPiecePositions(EMPTY_BOARD, pKey);
    Object.keys(pPositions).forEach(posKey => {
      pPositions[posKey].forEach(pPosition => {
        dance.addRow(x++, convertFromBoardPositionToDance(pKey, pPosition));
      });
    });
  });

  return dance;
}

const solve = (showSolution, showStatus, debug = false) => {
  const dance = prepareDataStructure();

  const cbShowStatus = (boardState, depth) => {
    return showStatus(convertFromDanceToBoardPosition(boardState), depth);
  };

  const cbShowSolution = solution => {
    if (isUniqueSolution(solution)) {
      return showSolution(convertFromDanceToBoardPosition(solution));
    }
  };

  // Solve
  dance.solve(0, {
    debug,
    showSolution: cbShowSolution,
    showStatus: cbShowStatus,
    validateBoard: cbIsValidBoard,
    isSolvedAlready: cbIsSolvedAlready
  });
};

export {
  solve
};
