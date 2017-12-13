function part1(input) {
  const lines = input.split('\n');
  const layers = {};
  let maxDepth = 0;

  lines.forEach(line => {
    const parts = line.split(': ');
    const depth = parseInt(parts[0], 10);
    const range = parseInt(parts[1], 10);

    layers[depth] = {
      scannerPosition: 0,
      scannerRange: range,
      scannerVelocity: 1,
    };

    maxDepth = Math.max(maxDepth, depth);
  });

  let tripSeverity = 0;

  for (let i = 0; i <= maxDepth; i++) {
    if (layers[i] && layers[i].scannerPosition === 0) {
      tripSeverity += i * layers[i].scannerRange;
    }

    Object.values(layers).forEach(layer => {
      const potentialNextPosition = layer.scannerPosition + layer.scannerVelocity;
      if (
        potentialNextPosition === layer.scannerRange ||
        potentialNextPosition === -1
      ) {
        layer.scannerVelocity *= -1;
      }

      layer.scannerPosition = layer.scannerPosition + layer.scannerVelocity;
    });
  }

  return tripSeverity;
}

function part2(input) {
  const lines = input.split('\n');
  const depths = [];
  const ranges = [];

  lines.forEach(line => {
    const parts = line.split(': ');
    depths.push(parseInt(parts[0], 10));
    ranges.push(parseInt(parts[1], 10));
  });

  let delay = 0;

  while (true) {
    let wasCaught = false;

    for (let i = 0; i < depths.length; i++) {
      const currentPicoSecond = delay + depths[i];
      const stepsToComeBackToZero = ranges[i] * 2 - 2;
      if (currentPicoSecond % stepsToComeBackToZero === 0) {
        wasCaught = true;
        break;
      }
    }

    if (!wasCaught) {
      return delay;
    }
    delay++;
  }
}

console.log('--- Part 1 ---');
console.log('Test 1:', part1(`
0: 3
1: 2
4: 4
6: 4
`.trim()) === 24 ? 'OK' : 'FAIL');
console.log('Result:', part1(getInput()));

console.log('');
console.log('--- Part 2 ---');
console.log('Test 1:', part2(`
0: 3
1: 2
4: 4
6: 4
`.trim()) === 10 ? 'OK' : 'FAIL');
console.log('Result:', part2(getInput()));

function getInput() {
  return `
0: 3
1: 2
2: 4
4: 6
6: 4
8: 6
10: 5
12: 6
14: 8
16: 8
18: 8
20: 6
22: 12
24: 8
26: 8
28: 10
30: 9
32: 12
34: 8
36: 12
38: 12
40: 12
42: 14
44: 14
46: 12
48: 12
50: 12
52: 12
54: 14
56: 12
58: 14
60: 14
62: 14
64: 14
70: 10
72: 14
74: 14
76: 14
78: 14
82: 14
86: 17
88: 18
96: 26
`.trim();
}