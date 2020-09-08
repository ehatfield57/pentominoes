// NewDance - Sparse Matrix
import { BOARD_TYPE } from '../env.mjs';
import { fixLen } from './utilities.mjs';
import { PIECE_PARTS } from './pieces.mjs';
import { useBoard } from './board.mjs';

let DEBUG = false;

const { BOARD_SQR_COUNT } = useBoard(BOARD_TYPE || 'testing');
const COL_WIDTH = 5;

class NewDance {
  constructor() {
    this.columns = [];
    this.rows = [];
    this.colIndex = {};
    this.rowIndex = {};
    this.solution = [];
    this.availableColumns = [];
  }

  addColumn(columnName, isPiece = false) {
    this.colIndex[columnName] = this.columns.length;

    this.columns.push({
      name: columnName,
      rows: [],
      isPiece
    });
  }

  getColumn(columnName) {
    return this.columns[this.colIndex[columnName]];
  }

  getRow(rowName) {
    return this.rows[this.rowIndex[rowName]];
  }

  addRow(rowName, columnNames) {
    if (!this.rowIndex[rowName]) {
      this.rowIndex[rowName] = this.rows.length;
      this.rows.push({
        name: rowName,
        columns: []
      });
    }

    const row = this.getRow(rowName);
    columnNames.forEach(columnName => {
      const column = this.getColumn(columnName);
      row.columns.push(column.name);
      column.rows.push(rowName);
    });
  }

  countEmptySquares() {
    return BOARD_SQR_COUNT - (this.solution.length * PIECE_PARTS);
  }

  notEnoughPieces(removedRows, removedColumns) {
    const emptyColumns = new Set();
    this.availableColumns = new Set();

    this.columns.forEach(column => {
      if (!removedColumns.has(column.name)) {
        if (column.isPiece) emptyColumns.add(column.name);
      }
    });

    this.rows.forEach(row => {
      if (!removedRows.has(row.name)) {
        row.columns.forEach(columnName => {
          if (emptyColumns.has(columnName)) {
            emptyColumns.delete(columnName);
            this.availableColumns.add(columnName);
          }
        });
      }
    });

    if (DEBUG) console.log('DEBUG: empty columns:', Array.from(emptyColumns));
    if (DEBUG) console.log('DEBUG: available columns:', Array.from(this.availableColumns));
    if (DEBUG) console.log('DEBUG: empty squares on board:', this.countEmptySquares());
    if (DEBUG) console.log('DEBUG: playable pieces square count:', this.availableColumns.size * PIECE_PARTS);

    return this.countEmptySquares() > (this.availableColumns.size * PIECE_PARTS);
  }

  sortByFewestRows(justPieces) {
    const counter = justPieces.reduce((accum, colName) => {
      const column = this.getColumn(colName);
      accum[colName] = column.rows.length;
      return accum;
    }, {});
    return Object.keys(counter).sort((a,b) => counter[a] - counter[b]);
  }

  solve(depth = 0, callbacks = {}, removedRows = new Set(), removedColumns = new Set()) {
    if (callbacks.debug) DEBUG = true;
    if (DEBUG) console.log('DEBUG: depth:', depth, ', dumpMatrix:\n' + this.dumpMatrix(removedRows, removedColumns) + '\n');
    if (DEBUG) console.log('DEBUG: solution set so far:', this.solution.map(row => row.name).join(','));
    if (DEBUG) console.log('DEBUG: removedRows:', removedRows);
    if (DEBUG) console.log('DEBUG: removedColumns:', removedColumns);

    if (this.rows.length === removedRows.size) {
      if (callbacks['isSolvedAlready'] && callbacks['isSolvedAlready'](this.solution)) {
        callbacks['showSolution'](this.solution);
      }
    } else {
      const notEnough = this.notEnoughPieces(removedRows, removedColumns);
      if (DEBUG) console.log('DEBUG: notEnoughPieces:', notEnough);
      if (notEnough) return;

      const justPieces = this.sortByFewestRows(Array.from(this.availableColumns));
      justPieces.forEach(columnName => {
        const newRemovedRows = [];
        const newRemovedColumns = [];

        const justRows = this.getColumn(columnName).rows.filter(rowName => {
          return !removedRows.has(rowName);
        });
        if (DEBUG) console.log('DEBUG: columnName:', columnName, ', just available rows:', justRows.join(','));

        for (let rIdx = 0; rIdx < justRows.length; rIdx++) {
          const row = this.rows[justRows[rIdx]];

          newRemovedRows.push(row.name);
          if (DEBUG) console.log('DEBUG: hidding row:', row.name);

          for (let cIdx = 0; cIdx < row.columns.length; cIdx++) {
            const column = this.getColumn(row.columns[cIdx]);

            if (!removedColumns.has(column.name)) {
              newRemovedColumns.push(column.name);
              if (DEBUG) console.log('DEBUG: hidding column:', column.name);

              for(let rIdx = 0; rIdx < column.rows.length; rIdx++) {
                const hidableRow = this.getRow(column.rows[rIdx]);

                if (!removedRows.has(hidableRow.name)) {
                  newRemovedRows.push(hidableRow.name);
                  if (DEBUG) console.log('DEBUG: hidding hidable row:', hidableRow.name);
                }
              }
            }
          }

          this.solution.push(row);
          if (DEBUG) console.log('DEBUG: adding row to solution:', row.name);

          if (!callbacks['validateBoard'] || callbacks['validateBoard'](this.solution, DEBUG)) {
            if (callbacks['showStatus']) callbacks['showStatus'](this.solution, depth, this);
            this.solve(depth + 1,
              callbacks,
              new Set(Array.from(removedRows).concat(newRemovedRows)),
              new Set(Array.from(removedColumns).concat(newRemovedColumns))
            );
          }

          if (DEBUG) console.log('DEBUG: removing row from solution:', row.name);
          this.solution.pop(row);
        }
      });
    }
  }

  dumpMatrix(removedRows, removedColumns) {
    const enabledColumns = this.columns.filter(col => !removedColumns.has(col.name));
    const enabledRows = this.rows.filter(row => !removedRows.has(row.name));

    const zero = fixLen('0', COL_WIDTH);
    const one = fixLen('1', COL_WIDTH);

    const matrix = Array(enabledRows.length + 1).fill(zero)
      .map((x => Array(enabledColumns.length + 1).fill(zero)));

    enabledColumns.forEach((col, i) => matrix[0][i + 1] = fixLen(col.name, COL_WIDTH));
    enabledRows.forEach((row, i) => matrix[i + 1][0] = fixLen(row.name, COL_WIDTH));
    matrix[0][0] = ' ';

    enabledRows.forEach((row, rowIndex) => {
      row.columns.forEach((columnName, j) => {
        const col = this.getColumn(columnName);
        const colIndex = enabledColumns.findIndex(col => col.name === columnName);
        if (!removedColumns.has(col.name)) {
          matrix[rowIndex + 1][colIndex + 1] = one;
        }
      });
    });

    return fixLen(' ', COL_WIDTH) + matrix.map(row => row.join(' ')).join('\n ');
  }
}

export {
  NewDance
};
