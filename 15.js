function part1(startValueA, startValueB) {
  const factorA = 16807;
  const factorB = 48271;
  let previousValueA = startValueA;
  let previousValueB = startValueB;
  let foundPairs = 0;

  for (let i = 0; i < 40000000; i++) {
    const nextValueA = (previousValueA * factorA) % 2147483647;
    const nextValueB = (previousValueB * factorB) % 2147483647;

    previousValueA = nextValueA;
    previousValueB = nextValueB;

    const sixteenBits = 2 ** 16;
    const lowestDigitsA = nextValueA % sixteenBits;
    const lowestDigitsB = nextValueB % sixteenBits;

    if (lowestDigitsA === lowestDigitsB) {
      foundPairs++;
    }
  }

  return foundPairs;
}

function part2(startValueA, startValueB) {
  const factorA = 16807;
  const factorB = 48271;
  let previousValueA = startValueA;
  let previousValueB = startValueB;
  let foundPairs = 0;
  let stackA = [];
  let stackB = [];

  while (stackA.length < 5000000 || stackB.length < 5000000) {
    const nextValueA = (previousValueA * factorA) % 2147483647;
    const nextValueB = (previousValueB * factorB) % 2147483647;

    previousValueA = nextValueA;
    previousValueB = nextValueB;

    if (nextValueA % 4 === 0) {
      stackA.push(nextValueA);
    }

    if (nextValueB % 8 === 0) {
      stackB.push(nextValueB);
    }
  }

  for (let i = 0; i < stackA.length; i++) {
    const sixteenBits = 2 ** 16;
    const lowestDigitsA = stackA[i] % sixteenBits;
    const lowestDigitsB = stackB[i] % sixteenBits;
    if (lowestDigitsA === lowestDigitsB) {
      foundPairs++;
    }
  }

  return foundPairs;
}

console.log('--- Part 1 ---');
console.log('Test 1:', part1(65, 8921) === 588 ? 'OK' : 'FAIL');
console.log('Result:', part1(703, 516));

console.log('');
console.log('--- Part 2 ---');
console.log('Test 1:', part2(65, 8921) === 309 ? 'OK' : 'FAIL');
console.log('Result:', part2(703, 516));
