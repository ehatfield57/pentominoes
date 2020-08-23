
import { NO_PIECE, PIECE_PARTS } from './pieces.mjs';
import { EMPTY_BOARD } from './board.mjs';
import { wanderAndCountEmpty, allNormalizedVariations } from './boardTools.mjs';
import { copy } from './utilities.mjs';

const solutions = {};

const convertFromBoardPositionToDance = (pKey, pPosition) => {
  const danceData = [ pKey ];
  pPosition.forEach(yx => danceData.push( yx.join(',')));
  return danceData;
};

const convertFromDanceToBoardPosition = solution => {
  const solutionBoard = copy(EMPTY_BOARD);
  
  solution.forEach(block => {
    const row = block.columns.slice();
    const pKey = row.shift();
    row.forEach(xy => {
      const [x, y] = xy.split(',');
      solutionBoard[parseInt(y)][parseInt(x)] = pKey;
    });
  });

  return solutionBoard;
};

const flipVert = (board) => {
  const flipped = copy(board);
  for (let rowIdx=0; rowIdx < flipped.length; rowIdx++) {
    for (let colIdx=0; colIdx < flipped[rowIdx].length / 2; colIdx++) {
      const holder = flipped[rowIdx][colIdx];
      flipped[rowIdx][colIdx] = flipped[rowIdx][flipped[rowIdx].length - colIdx - 1];
      flipped[rowIdx][flipped[rowIdx].length - colIdx - 1] = holder;
    }
  }
  return flipped;
};

const flipHoriz = (board) => {
  const flipped = copy(board);
  for (let rowIdx = 0; rowIdx < flipped.length / 2; rowIdx++) {
    const holder = flipped[rowIdx];
    flipped[rowIdx] = flipped[flipped.length - rowIdx - 1];
    flipped[flipped.length - rowIdx - 1] = holder;
  }
  return flipped;
};

const stringifyBoard = board => board.map(row => row.join('')).join('');

const phantomPiecesOnBoard = board => {
  const NON_PIECE = '.';
  const testBoard = copy(board);
  const piecesOnBoard = {};
  const pieceHoles = [];

  for (let y=0; y < testBoard.length; y++) {
    for (let x=0; x < testBoard[y].length; x++) {
      const sqr = testBoard[y][x];

      if (sqr !== NON_PIECE) {
        if (sqr === NO_PIECE) {
          const emptySet = wanderAndCountEmpty(testBoard, x, y);
          if (emptySet.length % PIECE_PARTS !== 0) return true; // wrong sized hold

          for (let emptyIdx=0; emptyIdx < emptySet.length; emptyIdx++) {
            const emptyCoor = emptySet[emptyIdx];
            testBoard[emptyCoor[1]][emptyCoor[0]] = NON_PIECE;
          }

          if (emptySet.length === 5) pieceHoles.push(emptySet);
        } else {
          if (!piecesOnBoard[sqr]) piecesOnBoard[sqr] = [];
          piecesOnBoard[sqr].push([x, y]);
        }
      }
    }
  }

  for (let holeIdx=0; holeIdx < pieceHoles.length; holeIdx++) {
    if (pieceAlreadyOnBoard(piecesOnBoard, pieceHoles[holeIdx])) return true;
  }

  return false;
};

const pieceAlreadyOnBoard = (pieces, hole) => {
  const topLeftHole = JSON.stringify(normalizePiece(hole));
  const pKey = allNormalizedVariations[topLeftHole];
  return pieces[pKey] ? true : false;
};

const reduce = (piece) => {
  for (let xy = 0; xy < 2; xy++) {
    const min = piece.reduce((accum, coor) => {
      return Math.min(accum, coor[xy]);
    }, 999);
    piece = piece.map(set => {
      set[xy] -= min;
      return set;
    });
  }
  return piece;
};

const sortSquares = (piece) => {
  return piece.sort((a, b) => {
    return (a[0]*100 + a[1]) - (b[0]*100 + b[1]);
  });
};

const normalizePiece = (origPiece) => {
  let piece = copy(origPiece);
  piece = sortSquares(reduce(piece));
  return piece;
};

const isUniqueSolution = (solution) => {
  const sol = convertFromDanceToBoardPosition(solution);
  const solSignature = stringifyBoard(sol);
  if (!solutions[solSignature]) {
    solutions[solSignature] = solSignature;
    solutions[stringifyBoard(flipVert(sol))] = solSignature;
    solutions[stringifyBoard(flipHoriz(sol))] = solSignature;
    solutions[stringifyBoard(flipVert(flipHoriz(sol)))] = solSignature;
    return true;
  } else {
    return false;
  }
};

export {
  convertFromBoardPositionToDance,
  convertFromDanceToBoardPosition,
  isUniqueSolution,
  phantomPiecesOnBoard
};