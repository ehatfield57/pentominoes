import { BOARD_TYPE } from '../env.mjs';
import { PIECE_PARTS, NO_PIECE } from './pieces.mjs';
import { moveTopLeft, rotate, stringify, flip, parse } from  './pieceTools.mjs';
import { useBoard } from './board.mjs';
import { copy } from './utilities.mjs';

const { BOARD_WIDE_SQ, BOARD_HIGH_SQ, PIECES } = useBoard(BOARD_TYPE || 'testing');

const MARK_SQUARE = '*';
const allNormalizedVariations = {};

const findVariations = (orig_piece) => {
  let piece = copy(orig_piece);
  const variations = [];

  for (let r=0; r < 4; r++) {
    variations.push(copy(piece));
    variations.push(copy(flip(piece)));
    piece = rotate(piece);
  }

  return variations;
};

const uniqueVariations = (orig_piece) => {
  const uniques = {};
  const variationArray = findVariations(orig_piece);

  for (let x=0; x < variationArray.length; x++) {
    const piece = moveTopLeft(variationArray[x]);
    const key = stringify(piece);
    uniques[key] = piece;
  }

  fillNormalizedVariations(Object.keys(uniques));

  return Object.values(uniques);
};

const sortSquares = (piece) => {
  return piece.sort((a, b) => {
    return (a[0]*100 + a[1]) - (b[0]*100 + b[1]);
  });
};

const fillNormalizedVariations = uniques => {
  for (let i=0; i < uniques.length; i++) {
    let pKey = '';
    const rows = uniques[i].split(',');
    const squares = [];
    for (let y=0; y < rows.length; y++) {
      for (let x in rows[y]) {
        const sqrSymbol = rows[y][x];
        if (sqrSymbol !== ' ') {
          pKey = sqrSymbol;
          squares.push([parseInt(x), y]);
        }
      }
    }
    allNormalizedVariations[JSON.stringify(sortSquares(squares))] = pKey;
  }
};

const otherPieceAlreadyThere = (board, pieceSquares) => {
  for (let x=0; x < pieceSquares.length; x++) {
    if (!sqrEmpty(board, pieceSquares[x][0], pieceSquares[x][1])) return true;
  }
  return false;
};

const sqrOnBoard = (x, y) => {
  if (x < 0 || x > BOARD_WIDE_SQ - 1) return false;
  if (y < 0 || y > BOARD_HIGH_SQ - 1) return false;
  return true;
};

const sqrEmpty = (board, x, y) => {
  return board[y][x] === NO_PIECE;
};

const sqrOnBoardAndEmpty = (board, x, y) => {
  if (sqrOnBoard(x, y) && sqrEmpty(board, x, y)) return true;
  return false;
};

const emptySquaresAround = (board, x, y) => {
  const squaresAround = [];
  if (sqrOnBoardAndEmpty(board, x-1, y  )) squaresAround.push([x-1, y  ]);
  if (sqrOnBoardAndEmpty(board, x+1, y  )) squaresAround.push([x+1, y  ]);
  if (sqrOnBoardAndEmpty(board, x  , y-1)) squaresAround.push([x  , y-1]);
  if (sqrOnBoardAndEmpty(board, x  , y+1)) squaresAround.push([x  , y+1]);
  return squaresAround;
};

const markSquare = (board, x, y) => {
  board[y][x] = MARK_SQUARE;
};

const wanderAndCountEmpty = (board, x, y) => {
  let emptySquares = [[x, y]];
  let saveEmptySquares = [];

  while (emptySquares.length > 0) {
    const sqr = emptySquares.pop();
    if (sqrEmpty(board, sqr[0], sqr[1])) {
      saveEmptySquares.push(sqr);
      markSquare(board, sqr[0], sqr[1]);
      emptySquares = emptySquares.concat(emptySquaresAround(board, sqr[0], sqr[1]));
    }
  }

  return saveEmptySquares;
};

const deadAreaOnBoard = board => {
  for (let y=0; y < BOARD_HIGH_SQ; y++) {
    for (let x=0; x < BOARD_WIDE_SQ; x++) {
      if (board[y][x] === NO_PIECE) {
        const squares = wanderAndCountEmpty(board, x, y);
        if (squares.length % PIECE_PARTS !== 0) return true;
      }
    }
  }
  return false;
};

const countEmptySquares = board => {
  let count = 0;
  for (let y=0; y < BOARD_HIGH_SQ; y++) {
    for (let x=0; x < BOARD_WIDE_SQ; x++) {
      if (board[y][x] === NO_PIECE) count += 1;
    }
  }
  return count;
}

const goodPlacement = (board, pieceSquares) => {
  if (otherPieceAlreadyThere(board, pieceSquares)) return false;
  const testBoard = placePiece(board, pieceSquares, MARK_SQUARE);
  return !deadAreaOnBoard(testBoard);
};

const onBoard = (pieceSquares) => {
  for (let i=0; i < pieceSquares.length; i++) {
    if (!sqrOnBoard(pieceSquares[i][0], pieceSquares[i][1])) return false;
  }
  return true;
};

const calculatePieceSquares = piece => {
  const squares = [];

  for (let x=0; x < PIECE_PARTS; x++) {
    for (let y=0; y < PIECE_PARTS; y++) {
      if (piece[y][x] !== NO_PIECE) {
        squares.push([x, y]);
      }
    }
  }

  return squares;
};

const shiftPieceSquares = (pieceSquares, xOffset, yOffset) => {
  const shiftedPieceSquares = [];

  for (let x=0; x < pieceSquares.length; x++) {
    shiftedPieceSquares[x] = [0, 0];
    shiftedPieceSquares[x][0] = pieceSquares[x][0] + xOffset;
    shiftedPieceSquares[x][1] = pieceSquares[x][1] + yOffset;
  }

  return shiftedPieceSquares;
};

const computePositionsOnBoard = (board, piece) => {
  const positions = [];
  const pieceSquares = calculatePieceSquares(moveTopLeft(piece));

  for (let yOffset=0; yOffset < BOARD_HIGH_SQ - 1; yOffset++) {
    for (let xOffset=0; xOffset < BOARD_WIDE_SQ - 1; xOffset++) {
      const shiftedPieceSquares = shiftPieceSquares(pieceSquares, xOffset, yOffset);

      if (onBoard(shiftedPieceSquares)) {
        if (goodPlacement(board, shiftedPieceSquares)) {
          positions.push(shiftedPieceSquares);
        }
      }
    }
  }

  return positions;
};

const placePiece = (orig_board, pieceSquares, pieceKey) => {
  return processPiece(orig_board, pieceSquares, pieceKey);
};

const removePiece = (orig_board, pieceSquares) => {
  return processPiece(orig_board, pieceSquares, NO_PIECE);
};

const processPiece = (orig_board, pieceSquares, pieceKey) => {
  const board = copy(orig_board);
  for (let x=0; x < pieceSquares.length; x++) {
    board[pieceSquares[x][1]][pieceSquares[x][0]] = pieceKey;
  }
  return board;
};

const generateAllPiecePositions = (orig_board, pieceKey) => {
  const variations = uniqueVariations(PIECES[pieceKey]);
  const allPositions = {};

  for (let v=0; v < variations.length; v++) {
    const variationKey = stringify(variations[v]);
    allPositions[variationKey] = computePositionsOnBoard(orig_board, variations[v]);
  }

  return allPositions;
};

function *pieceGenerator(orig_board, pieceKey) {
  const board = copy(orig_board);
  const allPositions = generateAllPiecePositions(board, pieceKey);
  const keys = Object.keys(allPositions);

  for (let y=0; y < keys.length; y++) {
    for (let x=0; x < allPositions[keys[y]].length; x++) {
      yield allPositions[keys[y]][x];
    }
  }
}

export {
  allNormalizedVariations,
  calculatePieceSquares,
  computePositionsOnBoard,
  countEmptySquares,
  deadAreaOnBoard,
  emptySquaresAround,
  findVariations,
  generateAllPiecePositions,
  goodPlacement,
  markSquare,
  onBoard,
  otherPieceAlreadyThere,
  pieceGenerator,
  placePiece,
  processPiece,
  removePiece,
  shiftPieceSquares,
  sqrEmpty,
  sqrOnBoard,
  sqrOnBoardAndEmpty,
  uniqueVariations,
  wanderAndCountEmpty
};

