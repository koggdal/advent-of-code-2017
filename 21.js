function convertFromGridToRule(grid) {
  return grid.map(row => row.join('')).join('/');
}

function convertFromRuleToGrid(rule) {
  return rule.split('/').map(row => row.split(''));
}

function rotate(grid, quadrants) {
  switch (quadrants) {
    case 1:
      if (grid.length === 2) {
        return [
          [grid[1][0], grid[0][0]],
          [grid[1][1], grid[0][1]],
        ];
      }
      if (grid.length === 3) {
        return [
          [grid[2][0], grid[1][0], grid[0][0]],
          [grid[2][1], grid[1][1], grid[0][1]],
          [grid[2][2], grid[1][2], grid[0][2]],
        ];
      }
    case 2:
      return flip(grid.slice().reverse(), 'x');
    case 3:
      return flip(flip(rotate(grid, 1), 'y'), 'x');
  }
}

function flip(grid, axis) {
  switch (axis) {
    case 'x':
      return grid.map(row => row.slice().reverse());
    case 'y':
      return grid.slice().reverse();
  }
}

function splitGrid(grid) {
  const gridOfGrids = [];

  const size = grid.length;
  const newSize = size % 2 === 0 ? 2 : 3;

  grid.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const subGridRowIndex = Math.floor(rowIndex / newSize);
      const subGridColIndex = Math.floor(colIndex / newSize);
      const rowIndexInSubGrid = rowIndex % newSize;

      if (!gridOfGrids[subGridRowIndex]) {
        gridOfGrids[subGridRowIndex] = [];
      }

      if (!gridOfGrids[subGridRowIndex][subGridColIndex]) {
        gridOfGrids[subGridRowIndex][subGridColIndex] = [];
      }

      if (!gridOfGrids[subGridRowIndex][subGridColIndex][rowIndexInSubGrid]) {
        gridOfGrids[subGridRowIndex][subGridColIndex][rowIndexInSubGrid] = [];
      }

      gridOfGrids[subGridRowIndex][subGridColIndex][rowIndexInSubGrid].push(col);
    });
  });

  return gridOfGrids;
}

function joinGrids(gridOfGrids) {
  const newGrid = [];

  gridOfGrids.forEach((gridRow, subGridRowIndex) => {
    gridRow.forEach(grid => {
      const subGridSize = grid.length;
      grid.forEach((row, rowIndex) => {
        const newRowIndex = subGridRowIndex * subGridSize + rowIndex;
        if (!newGrid[newRowIndex]) {
          newGrid[newRowIndex] = [];
        }
        row.forEach(col => {
          newGrid[newRowIndex].push(col);
        });
      });
    });
  });

  return newGrid;
}

function convertWithRules(grid, rules) {
  const attempts = [
    {type: 'self'},
    {type: 'flip', axis: 'x'},
    {type: 'flip', axis: 'y'},
    {type: 'rotate', quadrants: 1},
    {type: 'rotate', quadrants: 2},
    {type: 'rotate', quadrants: 3},
    {type: 'rotate-and-flip', quadrants: 1, axis: 'y'},
  ];

  for (let i = 0; i < attempts.length; i++) {
    let gridAsRule;

    if (attempts[i].type === 'self') {
      gridAsRule = convertFromGridToRule(grid);
    }

    if (attempts[i].type === 'rotate') {
      gridAsRule = convertFromGridToRule(rotate(grid, attempts[i].quadrants));
    }

    if (attempts[i].type === 'flip') {
      gridAsRule = convertFromGridToRule(flip(grid, attempts[i].axis));
    }

    if (attempts[i].type === 'rotate-and-flip') {
      gridAsRule = convertFromGridToRule(flip(rotate(grid, attempts[i].quadrants), attempts[i].axis));
    }

    if (rules[gridAsRule]) {
      return convertFromRuleToGrid(rules[gridAsRule]);
    }
  }
}

function part1(input, iterations) {
  const rules = {};

  input.split('\n').forEach(rule => {
    const ruleParts = rule.split(' => ');
    rules[ruleParts[0]] = ruleParts[1];
  });

  let grid = convertFromRuleToGrid('.#./..#/###');

  for (let i = 0; i < iterations; i++) {
    const gridOfGrids = splitGrid(grid);
    const newGridOfGrids = gridOfGrids.map(subGridRow => {
      return subGridRow.map(subGrid => {
        return convertWithRules(subGrid, rules);
      });
    });
    grid = joinGrids(newGridOfGrids);
  }

  const gridAsRule = convertFromGridToRule(grid);
  const litPixels = gridAsRule.replace(/[\.\/]/g, '');

  return litPixels.length;
}

function part2(input, iterations) {
  return part1(input, iterations);
}

console.log('--- Part 1 ---');
console.log('Test 1:', part1(`
../.# => ##./#../...
.#./..#/### => #..#/..../..../#..#
`.trim(), 2) === 12 ? 'OK' : 'FAIL');
console.log('Test 1:', convertFromGridToRule(rotate(convertFromRuleToGrid('..#/..#/..#'), 1)) === '.../.../###' ? 'OK' : 'FAIL');
console.log('Test 1:', convertFromGridToRule(rotate(convertFromRuleToGrid('..#/..#/..#'), 2)) === '#../#../#..' ? 'OK' : 'FAIL');
console.log('Test 1:', convertFromGridToRule(rotate(convertFromRuleToGrid('..#/..#/..#'), 3)) === '###/.../...' ? 'OK' : 'FAIL');
console.log('Test 1:', convertFromGridToRule(flip(convertFromRuleToGrid('..#/..#/..#'), 'x')) === '#../#../#..' ? 'OK' : 'FAIL');
console.log('Test 1:', convertFromGridToRule(flip(convertFromRuleToGrid('..#/.#./#..'), 'y')) === '#../.#./..#' ? 'OK' : 'FAIL');
console.log('Test 1:', convertFromGridToRule(rotate(convertFromRuleToGrid('.#./..#/###'), 3)) === '.##/#.#/..#' ? 'OK' : 'FAIL');
console.log('Result:', part1(getInput(), 5));

console.log('');
console.log('--- Part 2 ---');
console.log('Result:', part2(getInput(), 18));

function getInput() {
  return `
../.. => .../.##/.##
#./.. => .#./.#./##.
##/.. => ##./.../..#
.#/#. => #../..#/##.
##/#. => .../.#./..#
##/## => #.#/.##/.##
.../.../... => ##../.#../##../#..#
#../.../... => ..#./##.#/#.##/....
.#./.../... => ####/#.##/..../...#
##./.../... => ####/...#/.###/..##
#.#/.../... => ..#./..#./##../##.#
###/.../... => ..#./..#./##../...#
.#./#../... => ##.#/###./###./#..#
##./#../... => .#../..##/#.#./#.#.
..#/#../... => .##./..../...#/.###
#.#/#../... => ##../#..#/#..#/....
.##/#../... => ..../#.../..##/##..
###/#../... => ####/#.../.##./#...
.../.#./... => ####/#.../.###/###.
#../.#./... => #.#./.###/#.../##.#
.#./.#./... => .##./##.#/..##/.#..
##./.#./... => ..##/.#../..##/##.#
#.#/.#./... => .##./.#.#/.#.#/....
###/.#./... => ..../##.#/#.#./.###
.#./##./... => ..#./#.../#.../..##
##./##./... => ##.#/##.#/#.##/#...
..#/##./... => .#../.#.#/#.##/####
#.#/##./... => ..#./#.##/..../.##.
.##/##./... => #.##/..##/...#/....
###/##./... => ..#./#.../#.##/.#.#
.../#.#/... => ..##/#.#./##../#...
#../#.#/... => #.#./..#./.#../..##
.#./#.#/... => #.#./.#.#/.#../..##
##./#.#/... => ###./##.#/#..#/####
#.#/#.#/... => ##.#/..##/#.../...#
###/#.#/... => ##.#/..##/###./##..
.../###/... => ..../...#/##../.###
#../###/... => .##./##.#/..../#...
.#./###/... => ###./..##/.##./#...
##./###/... => .##./#..#/.###/.#..
#.#/###/... => ..../#.#./#.../#..#
###/###/... => .#../#.#./#.##/##.#
..#/.../#.. => ##../...#/.#../###.
#.#/.../#.. => #..#/.#../#.#./..#.
.##/.../#.. => #.##/.#../...#/.#.#
###/.../#.. => .#.#/#.../.#.#/.#..
.##/#../#.. => ..#./..../###./#...
###/#../#.. => .##./##../.#.#/##.#
..#/.#./#.. => ###./.##./###./.###
#.#/.#./#.. => ..../..../#.##/.#..
.##/.#./#.. => .#.#/.#.#/#.../####
###/.#./#.. => #.../####/#.##/#.#.
.##/##./#.. => #.../#.##/#.../###.
###/##./#.. => ...#/.##./#.../.##.
#../..#/#.. => ##../##../..##/....
.#./..#/#.. => #.#./##../.###/#.##
##./..#/#.. => #.#./####/.###/...#
#.#/..#/#.. => #..#/##.#/.#../..#.
.##/..#/#.. => .###/.#../#.##/.##.
###/..#/#.. => .###/#.##/..#./..##
#../#.#/#.. => ####/#.../####/##.#
.#./#.#/#.. => .###/####/####/.#..
##./#.#/#.. => ##.#/...#/..../##.#
..#/#.#/#.. => .#../..#./.##./.#..
#.#/#.#/#.. => ...#/###./..##/.###
.##/#.#/#.. => ####/##../#..#/##..
###/#.#/#.. => .#.#/..##/.###/##..
#../.##/#.. => #..#/#.##/#..#/.###
.#./.##/#.. => ##../.###/..../###.
##./.##/#.. => .###/.###/##../.##.
#.#/.##/#.. => ..#./.##./##../#.#.
.##/.##/#.. => ####/#..#/..#./....
###/.##/#.. => #.../.#../#..#/.#..
#../###/#.. => ..../.#../.##./.#.#
.#./###/#.. => ..../####/#.##/###.
##./###/#.. => ...#/.#../#.../##.#
..#/###/#.. => ####/###./###./....
#.#/###/#.. => .#../.###/##.#/.###
.##/###/#.. => #.##/##../##../.#..
###/###/#.. => .###/###./#..#/.#.#
.#./#.#/.#. => ###./.###/.###/.##.
##./#.#/.#. => .#.#/##../###./..#.
#.#/#.#/.#. => .#.#/##../###./#.##
###/#.#/.#. => ..#./.#../.#../..#.
.#./###/.#. => #..#/..##/#.#./#.#.
##./###/.#. => .#../#..#/#.#./.##.
#.#/###/.#. => .#.#/.##./.###/....
###/###/.#. => #.#./#.#./##../.#..
#.#/..#/##. => .#.#/.#.#/#..#/.#.#
###/..#/##. => #.#./##.#/.#../#.##
.##/#.#/##. => #.##/#.##/#.##/##.#
###/#.#/##. => ###./##../.#.#/#...
#.#/.##/##. => ##.#/.#.#/.#.#/.#.#
###/.##/##. => .#.#/#.##/####/....
.##/###/##. => #.../####/###./.###
###/###/##. => .##./#.#./#.##/##..
#.#/.../#.# => #.../##.#/#.##/##.#
###/.../#.# => #.#./#.##/##.#/.##.
###/#../#.# => ##../.#.#/##.#/#...
#.#/.#./#.# => .##./.#../#.../.#.#
###/.#./#.# => #.#./..##/###./..##
###/##./#.# => .###/..##/..#./..#.
#.#/#.#/#.# => .#../##.#/.#.#/.#.#
###/#.#/#.# => ##.#/.#.#/...#/...#
#.#/###/#.# => ##.#/.#../####/#..#
###/###/#.# => ...#/..##/##../#..#
###/#.#/### => ..##/.##./.##./#.##
###/###/### => #.#./.#.#/#.../.##.
`.trim();
}