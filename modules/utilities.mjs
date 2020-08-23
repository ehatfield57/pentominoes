
const COLUMN_WIDTH = 4;

const sqrId = (x, y) => `sqr_${x}_${y}`;

const copy = thing => JSON.parse(JSON.stringify(thing));

const fixLen = (str, len=COLUMN_WIDTH) => {
  let out = '     ' + str;
  return out.substr(out.length - len, len);
};

const joinFixLen = (ary, len=COLUMN_WIDTH, add=', ') => {
  return ary.map(item => fixLen(item, len)).join(add);
};

const walkDir = (link, direction) => {
  let links = [];
  if (link.value !== 'h') links.push(link);

  let pointer = link[direction];
  while (pointer !== link) {
    if (pointer.value !== 'h') links.push(pointer);
    pointer = pointer[direction];
  }

  return links;
};

function *genWalkDir(link, direction) {
  if (link.value !== 'h') yield link;
  let pointer = link[direction];
  while (pointer !== link) {
    if (pointer.value !== 'h') yield pointer;
    pointer = pointer[direction];
  }
}

export {
  sqrId,
  copy,
  fixLen,
  joinFixLen,
  walkDir,
  genWalkDir,
  COLUMN_WIDTH
};
