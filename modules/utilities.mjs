import { BOARD_WIDE_SQ, BOARD_HIGH_SQ } from './board.mjs';
import { COLORS } from './pieces.mjs';

const COLUMN_WIDTH = 4;

const drawBoard = (board) => {
  for (let y=0; y < BOARD_HIGH_SQ; y++) {
    for (let x=0; x < BOARD_WIDE_SQ; x++) {
      drawSquare(board, x, y);
    }
  }
};

const drawSquare = (board, x, y) => {
  const element = document.getElementById(sqrId(x, y));
  if (element) {
    const borderStr = borders(board, x, y);
    const color = COLORS[board[y][x]];

    element.style.borderLeftColor   = borderStr.includes('l') ? 'black' : color;
    element.style.borderRightColor  = borderStr.includes('r') ? 'black' : color;
    element.style.borderTopColor    = borderStr.includes('t') ? 'black' : color;
    element.style.borderBottomColor = borderStr.includes('b') ? 'black' : color;
    element.style.backgroundColor   = color;
  }
};

const borders = (board, x, y) => {
  const piece = board[y][x];

  const borderLeft   = (x, y) => x === 0 || piece !== board[y][x - 1];
  const borderRight  = (x, y) => x + 1 === BOARD_WIDE_SQ || piece !== board[y][x + 1];
  const borderTop    = (x, y) => y === 0 || piece !== board[y - 1][x];
  const borderBottom = (x, y) => y + 1 === BOARD_HIGH_SQ || piece !== board[y + 1][x];

  return [
    borderTop(x, y)    ? 't' : '',
    borderLeft(x, y)   ? 'l' : '',
    borderBottom(x, y) ? 'b' : '',
    borderRight(x, y)  ? 'r' : '',
  ].join('');
};

const sqrId = (x, y) => `sqr_${x}_${y}`;

const copy = thing => JSON.parse(JSON.stringify(thing));

const fixLen = (str, len=COLUMN_WIDTH) => {
  let out = '     ' + str;
  return out.substr(out.length - len, len);
};

export {
  copy,
  sqrId,
  fixLen,
  COLUMN_WIDTH,
  drawBoard
};
