const RIGHT = Symbol('right');
const UP = Symbol('up');
const LEFT = Symbol('left');
const DOWN = Symbol('down');

const DIRECTIONS = [
  RIGHT,
  UP,
  LEFT,
  DOWN,
];

function spiralMemory(input, options = {}) {
  const storage = new Proxy({}, {
    get(target, key) {
      return target[key] || 0;
    },
  });

  storage['0:0'] = 1;

  let directionIndex = 0;
  let size = 1;
  let increase = 8;
  let layer = 1;
  let x = 0;
  let y = 0;

  if (input === 1) {
    return 0;
  }

  for (let i = 2; i <= input; i++) {
    const direction = DIRECTIONS[directionIndex];
    let shouldChangeDirection = false;

    switch (direction) {
      case RIGHT:
        if (x < layer) {
          x++;
        } else {
          shouldChangeDirection = true;
        }
        break;
      case UP:
        if (y > -layer) {
          y--;
        } else {
          shouldChangeDirection = true;
        }
        break;
      case LEFT:
        if (x > -layer) {
          x--;
        } else {
          shouldChangeDirection = true;
        }
        break;
      case DOWN:
        if (y < layer) {
          y++;
        } else {
          shouldChangeDirection = true;
        }
        break;
    }

    if (shouldChangeDirection) {
      directionIndex = DIRECTIONS[directionIndex + 1] ? directionIndex + 1 : 0;
      i--;
      continue;
    }

    if (options.returnFirstLargerValue) {
      storage[`${x}:${y}`] = (
        storage[`${x - 1}:${y - 1}`] + storage[`${x}:${y - 1}`] + storage[`${x + 1}:${y - 1}`] +
        storage[`${x - 1}:${y}`] + storage[`${x}:${y}`] + storage[`${x + 1}:${y}`] +
        storage[`${x - 1}:${y + 1}`] + storage[`${x}:${y + 1}`] + storage[`${x + 1}:${y + 1}`]
      );

      if (storage[`${x}:${y}`] > input) {
        return storage[`${x}:${y}`];
      }
    }

    if (i === input) {
      return Math.abs(x) + Math.abs(y);
    }

    if (i === size + increase) {
      size += increase;
      layer++;
      increase += 8;
    }
  }
}

console.log('--- Part 1 ---');
console.log('Test (1):', spiralMemory(1) === 0);
console.log('Test (12):', spiralMemory(12) === 3);
console.log('Test (23):', spiralMemory(23) === 2);
console.log('Test (1024):', spiralMemory(1024) === 31);
console.log('Result:', spiralMemory(312051));

console.log('');
console.log('--- Part 2 ---');
console.log('Result:', spiralMemory(312051, {returnFirstLargerValue: true}));
