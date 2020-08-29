
import { solve } from './modules/newSolver.mjs';

const cbShowSolution = (solution) => {
  postMessage({ callback: 'cbShowSolution', data: JSON.stringify(solution) });
};

const cbShowStatus = (status, depth) => {
  postMessage({ callback: 'cbShowStatus', data: { status: JSON.stringify(status), depth } });
};

onmessage = e => {
  if (e.data.state === 'go') {
    console.log('Starting to solve...');
    solve(cbShowSolution, cbShowStatus, e.data.debug || false);
  } else {
    postMessage({ error: 'Unknown state requested: ' + e.data.state })
  }
};
