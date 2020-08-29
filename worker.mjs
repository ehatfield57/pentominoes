
import { solve } from './modules/newSolver.mjs';

const cbShowSolution = (solution) => {
  postMessage({ callback: 'cbShowSolution', data: JSON.stringify(solution) });
};

const cbShowStatus = (status, depth) => {
  postMessage({ callback: 'cbShowStatus', data: { status: JSON.stringify(status), depth } });
};

const cbFlash = (row) => {
  postMessage({ callback: 'cbFlash', data: JSON.stringify(row) });
};

onmessage = e => {
  if (e.data.state === 'go') {
    solve(cbShowSolution, cbShowStatus, cbFlash);
  } else if (e.data.state === 'stop') {
    foobar(); // Non-existant function so it blows up
  } else {
    postMessage({ error: 'Unknown state requested: ' + e.data.state })
  }
};
