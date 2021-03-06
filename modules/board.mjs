import { NO_PIECE, ALL_PIECES, SQUARE_WIDE_PX, BORDER_WIDTH_PX } from './pieces.mjs';

const boards = {
  'withHole': [
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', '*', '*', '*', '*', '*', '*', '*', '*', ' '],
    [' ', '*', '*', '*', '*', '*', '*', '*', '*', ' '],
    [' ', '*', '*', '*', '*', '*', '*', '*', '*', ' '],
    [' ', '*', '*', '*', ' ', ' ', '*', '*', '*', ' '],
    [' ', '*', '*', '*', ' ', ' ', '*', '*', '*', ' '],
    [' ', '*', '*', '*', '*', '*', '*', '*', '*', ' '],
    [' ', '*', '*', '*', '*', '*', '*', '*', '*', ' '],
    [' ', '*', '*', '*', '*', '*', '*', '*', '*', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
  ],
  '6x10': [
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', ' '],
    [' ', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', ' '],
    [' ', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', ' '],
    [' ', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', ' '],
    [' ', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', ' '],
    [' ', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
  ],
  '20x3': [
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', ' '],
    [' ', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', ' '],
    [' ', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
  ],
  'V': [
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', '*', '*', '*', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', '*', '*', '*', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', '*', '*', '*', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', '*', '*', '*', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', '*', '*', '*', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', '*', '*', '*', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', '*', '*', '*', '*', '*', '*', '*', '*', '*', ' '],
    [' ', '*', '*', '*', '*', '*', '*', '*', '*', '*', ' '],
    [' ', '*', '*', '*', '*', '*', '*', '*', '*', '*', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
  ],
  'testing': [ // should have two solutions: ip or vl
    [' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', '*', ' ', ' ', ' ', ' '],
    [' ', ' ', '*', ' ', ' ', ' ', ' '],
    [' ', ' ', '*', '*', '*', ' ', ' '],
    [' ', ' ', '*', '*', '*', '*', ' '],
    [' ', ' ', '*', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' '],
  ],
  '5x6': [
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', '*', '*', '*', '*', '*', '*', ' '],
    [' ', '*', '*', '*', '*', '*', '*', ' '],
    [' ', '*', '*', '*', '*', '*', '*', ' '],
    [' ', '*', '*', '*', '*', '*', '*', ' '],
    [' ', '*', '*', '*', '*', '*', '*', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '] 
  ]
};


const NoVee = JSON.parse(JSON.stringify(ALL_PIECES));
delete(NoVee['v']);

const boardConfigurations = {
  '6x10': {
    board: boards['6x10'],
    pieces: ALL_PIECES
  },
  'withHole': {
    board: boards.withHole,
    pieces: ALL_PIECES
  },
  '20x3': {
    board: boards['20x3'],
    pieces: ALL_PIECES
  },
  'V': {
    board: boards.V,
    pieces: NoVee
  },
  'testing': {
    board: boards.testing,
    pieces: ALL_PIECES
  },
  '5x6': {
    board: boards['5x6'],
    pieces: ALL_PIECES
  }
};

const BOARD_SPOT = '*';
const NOT_BOARD_SPOT = '.';

const useBoard = (boardType) => {
  const { board: RAW_BOARD, pieces: PIECES } = boardConfigurations[boardType];

  function initializeBoard(boardShape) {
    let board =  JSON.parse(JSON.stringify(boardShape));
    for (let y=0; y < RAW_BOARD.length; y++) {
      for (let x=0; x < RAW_BOARD[0].length; x++) {
        board[y][x] = board[y][x] === BOARD_SPOT ? NO_PIECE : NOT_BOARD_SPOT;
      }
    }
    return board;
  }

  const BOARD_WIDE_SQ = RAW_BOARD[0].length;
  const BOARD_HIGH_SQ = RAW_BOARD.length;
  const EMPTY_BOARD = initializeBoard(RAW_BOARD);
  const pieceKeys = Object.keys(PIECES);

  const BOARD_WIDTH_PX = BOARD_WIDE_SQ * (SQUARE_WIDE_PX + (2 * BORDER_WIDTH_PX));

  const computeBoardSqrCount = () => {
    let sqrCount = 0;
    for (let y=0; y < RAW_BOARD.length; y++) {
      for (let x=0; x < RAW_BOARD[0].length; x++) {
        if (RAW_BOARD[y][x] === BOARD_SPOT) sqrCount += 1;
      }
    }
    return sqrCount;
  }
  
  const BOARD_SQR_COUNT = computeBoardSqrCount();

  return {
    BOARD_WIDE_SQ,
    BOARD_HIGH_SQ,
    EMPTY_BOARD,
    RAW_BOARD,
    initializeBoard,
    PIECES,
    pieceKeys,
    BOARD_WIDTH_PX,
    BOARD_SQR_COUNT
  }
}

export {
  useBoard
}
