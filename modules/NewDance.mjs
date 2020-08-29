// NewDance - Sparse Matrix
import { fixLen } from './utilities.mjs';

let DEBUG = false;

const COL_WIDTH = 5;

class NewDance {
  constructor() {
    this.columns = [];
    this.rows = [];
    this.colIndex = {};
    this.rowIndex = {};
    this.solution = [];
  }

  addColumn(columnName) {
    this.colIndex[columnName] = this.columns.length;

    this.columns.push({
      name: columnName,
      enabled: true,
      rows: []
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
        enabled: true,
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

  solve(depth = 0, callbacks = {}) {
    if (callbacks.debug) DEBUG = true;
    if (DEBUG) console.log('Hi Edward, depth:', depth, ', dumpMatrix:\n' + this.dumpMatrix() + '\n');
    if (DEBUG) console.log('Hi Edward, solution set so far:', this.solution.map(row => row.name).join(','));

    const enabledRow = this.rows.find(row => row.enabled);
    if (enabledRow === undefined) {
      if (callbacks['isSolvedAlready'] && callbacks['isSolvedAlready'](this.solution)) {
        callbacks['showSolution'](this.solution);
      }
    } else {
      const hidden = [];
      for (let rowIdx = 0; rowIdx < this.rows.length; rowIdx++) {
        const row = this.rows[rowIdx];
        if (row.enabled) {
          row.enabled = false;
          hidden.push(row);
          if (DEBUG) console.log('Hi Edward, hidding row:', row.name);

          for (let cIdx = 0; cIdx < row.columns.length; cIdx++) {
            const column = this.getColumn(row.columns[cIdx]);
            if (column.enabled) {
              column.enabled = false;
              hidden.push(column);
              if (DEBUG) console.log('Hi Edward, hidding column:', column.name);

              for(let rIdx = 0; rIdx < column.rows.length; rIdx++) {
                const hidableRow = this.getRow(column.rows[rIdx]);
                if (hidableRow.enabled) {
                  hidableRow.enabled = false;
                  hidden.push(hidableRow);
                  if (DEBUG) console.log('Hi Edward, hidding hidable row:', hidableRow.name);
                }
              }
            }
          }

          this.solution.push(row);
          if (DEBUG) console.log('Hi Edward, adding row to solution:', row.name);

          if (!callbacks['validateBoard'] || callbacks['validateBoard'](this.solution)) {
            if (callbacks['showStatus']) callbacks['showStatus'](this.solution, depth, this);
            this.solve(depth + 1, callbacks);
          }

          if (DEBUG) console.log('Hi Edward, removing row from solution:', row.name);
          this.solution.pop(row);

          if (DEBUG) console.log('Hi Edward, unhiding all hidden rows');
          hidden.forEach(item => item.enabled = true);
        }
      }
    }
  }

  dumpMatrix() {
    const enabledColumns = this.columns.filter(col => col.enabled);
    const enabledRows = this.rows.filter(row => row.enabled);

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
        if (row.enabled && col.enabled) {
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
