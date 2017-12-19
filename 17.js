function part1(stepSize) {
  const buffer = [0];
  let currentIndex = 0;
  let insertionCount = 0;

  while (insertionCount < 2017) {
    const indexAfterStep = (currentIndex + stepSize) % buffer.length;
    currentIndex = indexAfterStep + 1;
    buffer.splice(currentIndex, 0, insertionCount + 1);
    insertionCount++;
  }

  return buffer[(currentIndex + 1) % buffer.length];
}

function part2(stepSize) {
  let currentIndex = 0;
  let insertionCount = 0;
  let lastSecondValue = 0;

  while (insertionCount < 50000000) {
    const indexAfterStep = (currentIndex + stepSize) % (insertionCount + 1);
    currentIndex = indexAfterStep + 1;
    if (currentIndex === 1) {
      lastSecondValue = insertionCount + 1;
    }

    insertionCount++;

    if (insertionCount === 50000000) {
      return lastSecondValue;
    }
  }
}

console.log('--- Part 1 ---');
console.log('Test 1:', part1(3) === 638 ? 'OK' : 'FAIL');
console.log('Result:', part1(301));

console.log('');
console.log('--- Part 2 ---');
console.log('Result:', part2(301));
