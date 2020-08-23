// import { solve } from './modules/newSolver.mjs';

onmessage = function(e) {
  console.log('Hi Edward, worker received message:', e.data);
  postMessage('That was fun');
  // solve(cbShowSolution, cbStatus);
}