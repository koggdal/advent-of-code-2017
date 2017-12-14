// This function is just copied from 10.js
function runRound({
  list,
  lengths,
  state,
}) {
  for (const length of lengths) {
    let sublistEnd = list.slice(
      state.currentPosition, Math.min(state.currentPosition + length, list.length)
    );
    let sublistStart = list.slice(
      0, Math.max(0, state.currentPosition + length - list.length)
    );
    const sublist = sublistEnd.concat(sublistStart);

    sublist.reverse();

    sublistEnd = sublist.slice(0, sublistEnd.length);
    sublistStart = sublist.slice(
      sublistEnd.length,
      sublistEnd.length + sublistStart.length
    );

    list.splice(state.currentPosition, sublistEnd.length, ...sublistEnd);
    list.splice(0, sublistStart.length, ...sublistStart);

    const jump = length + state.skipSize;
    const overflow = (state.currentPosition + jump - list.length) % list.length;
    state.currentPosition = overflow < 0
      ? state.currentPosition + jump
      : overflow;

    state.skipSize++;
  }
}

// This function is just copied from 10.js
function computeKnotHash(input) {
  const list = new Array(256).fill(1).map((item, index) => index);
  const lengths = [...input].map(char => char.charCodeAt(0));
  lengths.push(17, 31, 73, 47, 23);

  const state = {
    currentPosition: 0,
    skipSize: 0,
  };

  for (let i = 0; i < 64; i++) {
    runRound({
      list,
      lengths,
      state,
    });
  }

  let denseHash = '';
  const block = [];

  for (let i = 0; i <= 257; i++) {
    if (i % 16 === 0 && i !== 0) {
      denseHash += block.reduce((denseValue, value) => {
        return denseValue ^ value;
      }, 0).toString(16).padStart(2, '0');
      block.length = 0;
    }

    block.push(list[i]);
  }

  return denseHash;
}

function markWithGroupNumber(grid, gridWithGroups, originRow, originCol, groupNumber) {
  const listOfData = [[originRow, originCol]];
  let didWriteGroup = false;

  while (listOfData.length > 0) {
    const [row, col] = listOfData.shift();

    if (gridWithGroups[`${row}:${col}`]) {
      continue;
    }

    if (grid[`${row}:${col}`]) {
      gridWithGroups[`${row}:${col}`] = groupNumber;
      didWriteGroup = true;
    } else {
      continue;
    }

    const up = [row - 1, col];
    const right = [row, col + 1];
    const down = [row + 1, col];
    const left = [row, col - 1];

    [up, right, down, left].forEach(([row, col]) => {
      if (grid[`${row}:${col}`]) {
        listOfData.push([row, col]);
      }
    });
  }

  return didWriteGroup;
}

function part1(input) {
  let usedSquareCount = 0;

  for (let i = 0; i < 128; i++) {
    const hashInput = `${input}-${i}`;
    const hash = computeKnotHash(hashInput);

    let hashInBinary = '';
    for (let a = 0; a < hash.length; a++) {
      const hashCharacter = hash[a];
      const hashCharacterBinary = parseInt(hashCharacter, 16).toString(2).padStart(4, '0');
      hashInBinary += hashCharacterBinary;
    }

    usedSquareCount += hashInBinary.replace(/0/g, '').length;
  }

  return usedSquareCount;
}

function part2(input) {
  let grid = {};

  for (let row = 0; row < 128; row++) {
    const hashInput = `${input}-${row}`;
    const hash = computeKnotHash(hashInput);

    let hashInBinary = '';
    for (let a = 0; a < hash.length; a++) {
      const hashCharacter = hash[a];
      const hashCharacterBinary = parseInt(hashCharacter, 16).toString(2).padStart(4, '0');
      hashInBinary += hashCharacterBinary;
    }

    for (let col = 0; col < hashInBinary.length; col++) {
      grid[`${row}:${col}`] = hashInBinary[col] === '1';
    }
  }

  let gridWithGroups = {};
  let lastGroupNumber = 1;

  for (let row = 0; row < 128; row++) {
    for (let col = 0; col < 128; col++) {
      if (markWithGroupNumber(grid, gridWithGroups, row, col, lastGroupNumber)) {
        lastGroupNumber++;
      }
    }
  }

  // This is for printing the grid for debugging... it's also not correct for some
  // reason, but the resulting amount of groups becomes correct, so whatever :)
  const rows = [];
  for (let row = 0; row < 8; row++) {
    const rowArray = [];
    rows.push(rowArray);
    for (let col = 0; col < 8; col++) {
      const value = gridWithGroups[`${row}:${col}`];
      rowArray.push(value ? value.toString().padStart(2, '0') : '..');
    }
  }
  rows.forEach(row => {
    console.log(row.join(' '));
  });

  return lastGroupNumber - 1;
}

console.log('--- Part 1 ---');
console.log('Test 1:', part1('flqrgnkx') === 8108 ? 'OK' : 'FAIL');
console.log('Result:', part1('ffayrhll'));

console.log('');
console.log('--- Part 2 ---');
console.log('Test 1:', part2('flqrgnkx') === 1242 ? 'OK' : 'FAIL');
console.log('Result:', part2('ffayrhll'));
