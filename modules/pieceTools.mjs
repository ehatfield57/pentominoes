import { BOARD_TYPE } from '../env.mjs';
import { PIECE_PARTS } from './pieces.mjs';
import { copy } from './utilities.mjs';
import { useBoard } from './board.mjs';

const { PIECES } = useBoard(BOARD_TYPE || 'testing');

const emptyGroup = ' '.repeat(PIECE_PARTS);

const getRow = (piece, row) => {
  return piece[row].join('');
};

const getCol = (piece, col) => {
  const parts = new Array(PIECE_PARTS);
  return piece.map(row => row[col]).join('');
};

const stringify = piece => {
  return piece.map((row, i) => getRow(piece, i)).join(',');
};

const shiftLeft = orig_piece => {
  const piece = copy(orig_piece);
  for (let r=0; r < PIECE_PARTS; r++) {
    for (let c=0; c < PIECE_PARTS - 1; c++) {
      piece[r][c] = piece[r][c + 1];
    }
  }
  return setCol(piece, 4, emptyGroup);
};

const shiftUp = orig_piece => {
  const piece = copy(orig_piece);
  for (let r=0; r < PIECE_PARTS - 1; r++) {
    piece[r] = piece[r + 1];
  }
  return setRow(piece, 4, emptyGroup);
};

const setRow = (orig_piece, i, row) => {
  const piece = copy(orig_piece);
  piece[i] = row.split('');
  return piece;
};

const setCol = (orig_piece, i, col) => {
  const piece = copy(orig_piece);

  let row = 0;
  col.split('').forEach(ch => {
    piece[row++][i] = ch;
  });

  return piece;
};

const moveTopLeft = orig_piece => {
  let piece = copy(orig_piece);

  while (getCol(piece, 0) === emptyGroup) {
    piece = shiftLeft(piece);
  }

  while (getRow(piece, 0) === emptyGroup) {
    piece = shiftUp(piece);
  }

  return piece;
};

const rotate = orig_piece => {
  let piece = copy(orig_piece);

  for (let x=0; x < PIECE_PARTS; x++) {
    const row = getRow(orig_piece, x);
    piece = setCol(piece, PIECE_PARTS - x - 1, row);
  }

  return piece;
};

const flip = orig_piece => {
  let piece = copy(orig_piece);

  for (let x=0; x < PIECE_PARTS / 2; x++) {
    const holdRow = getRow(piece, x);
    const other = PIECE_PARTS - x - 1;

    if (x !== other) {
      piece = setRow(piece, x, getRow(piece, other));
      piece = setRow(piece, other, holdRow);
    }
  }

  return piece;
};

const parse = str => {
  return str.split(',').map(row => row.split(''));
};

export {
  getRow,
  getCol,
  stringify,
  shiftLeft,
  shiftUp,
  setCol,
  setRow,
  moveTopLeft,
  rotate,
  flip,
  parse,
};

