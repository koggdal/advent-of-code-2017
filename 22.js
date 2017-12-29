const UP = Symbol('UP');
const DOWN = Symbol('DOWN');
const LEFT = Symbol('LEFT');
const RIGHT = Symbol('RIGHT');

const CLEAN = Symbol('CLEAN');
const WEAKENED = Symbol('WEAKENED');
const INFECTED = Symbol('INFECTED');
const FLAGGED = Symbol('FLAGGED');

function getDirectionRight(direction) {
  switch (direction) {
    case UP: return RIGHT;
    case RIGHT: return DOWN;
    case DOWN: return LEFT;
    case LEFT: return UP;
  }
}

function getDirectionLeft(direction) {
  switch (direction) {
    case UP: return LEFT;
    case LEFT: return DOWN;
    case DOWN: return RIGHT;
    case RIGHT: return UP;
  }
}

function getDirectionReverse(direction) {
  switch (direction) {
    case UP: return DOWN;
    case DOWN: return UP;
    case LEFT: return RIGHT;
    case RIGHT: return LEFT;
  }
}

function part1(input, bursts) {
  const map = {};

  input.split('\n').forEach((row, rowIndex, inputRows) => {
    const centerX = Math.floor(row.length / 2);
    const centerY = Math.floor(inputRows.length / 2);

    row.split('').forEach((item, colIndex) => {
      map[`${colIndex - centerX}:${rowIndex - centerY}`] = item === '#';
    });
  });

  let x = 0;
  let y = 0;
  let direction = UP;
  let burstsWithInfection = 0;

  for (let i = 0; i < bursts; i++) {
    const isInfected = map[`${x}:${y}`];
    direction = isInfected ? getDirectionRight(direction) : getDirectionLeft(direction);

    const shouldBecomeInfected = !isInfected;

    map[`${x}:${y}`] = shouldBecomeInfected;

    switch (direction) {
      case LEFT: x--; break;
      case RIGHT: x++; break;
      case UP: y--; break;
      case DOWN: y++; break;
    }

    if (shouldBecomeInfected) {
      burstsWithInfection++;
    }
  }

  return burstsWithInfection;
}

function part2(input, bursts) {
  const map = {};

  input.split('\n').forEach((row, rowIndex, inputRows) => {
    const centerX = Math.floor(row.length / 2);
    const centerY = Math.floor(inputRows.length / 2);

    row.split('').forEach((item, colIndex) => {
      map[`${colIndex - centerX}:${rowIndex - centerY}`] = item === '#' ? INFECTED : CLEAN;
    });
  });

  let x = 0;
  let y = 0;
  let direction = UP;
  let burstsWithInfection = 0;

  for (let i = 0; i < bursts; i++) {
    const state = map[`${x}:${y}`] || CLEAN;

    switch (state) {
      case CLEAN:
        direction = getDirectionLeft(direction);
        map[`${x}:${y}`] = WEAKENED;
        break;
      case WEAKENED:
        map[`${x}:${y}`] = INFECTED;
        burstsWithInfection++;
        break;
      case INFECTED:
        direction = getDirectionRight(direction);
        map[`${x}:${y}`] = FLAGGED;
        break;
      case FLAGGED:
        direction = getDirectionReverse(direction);
        map[`${x}:${y}`] = CLEAN;
        break;
    }

    switch (direction) {
      case LEFT: x--; break;
      case RIGHT: x++; break;
      case UP: y--; break;
      case DOWN: y++; break;
    }
  }

  return burstsWithInfection;
}

console.log('--- Part 1 ---');
console.log('Test 1:', part1(getTestInput(), 7) === 5 ? 'OK' : 'FAIL');
console.log('Test 2:', part1(getTestInput(), 70) === 41 ? 'OK' : 'FAIL');
console.log('Test 3:', part1(getTestInput(), 10000) === 5587 ? 'OK' : 'FAIL');
console.log('Result:', part1(getInput(), 10000));

console.log('');
console.log('--- Part 2 ---');
console.log('Test 1:', part2(getTestInput(), 100) === 26 ? 'OK' : 'FAIL');
console.log('Test 2:', part2(getTestInput(), 10000000) === 2511944 ? 'OK' : 'FAIL');
console.log('Result:', part2(getInput(), 10000000));

function getTestInput() {
  return `
..#
#..
...
`.trim();
}

function getInput() {
  return `
...#.#.####.....#.##..###
##.#.###..#.....#.##...#.
..#.##..#.#.##.#...#..###
###...##....###.#..#...#.
...#..#.........##..###..
#..#.#.#.#.#.#.#.##.####.
#...#.##...###...##..#..#
##...#.###..###...####.##
###..#.#####.##..###.#.##
#..#....#.##..####...####
...#.#......###.#..#..##.
.#.#...##.#.#####..###.#.
.....#..##..##..###....##
#.#..###.##.##.#####.##..
###..#..###.##.#..#.##.##
.#######.###....######.##
..#.#.###.##.##...###.#..
#..#.####...###..###..###
#...#..###.##..##...#.#..
........###..#.#.##..##..
.#############.#.###..###
##..#.###....#.#..#..##.#
..#.#.#####....#..#####..
.#.#..#...#...##.#..#....
##.#..#..##........#..##.
`.trim();
}