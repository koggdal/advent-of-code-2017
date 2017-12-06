function cycle(banks) {
  let maxValue = 0;
  let maxIndex = 0;

  banks.forEach((bank, index) => {
    if (bank > maxValue) {
      maxValue = bank;
      maxIndex = index;
    }
  });

  for (let bankCounter = 0; bankCounter < maxValue + 1; bankCounter++) {
    const bankIndex = (maxIndex + bankCounter) % banks.length;
    if (bankCounter === 0) {
      banks[bankIndex] = 0;
    } else {
      banks[bankIndex]++;
    }
  }
}

function part1(input, { returnTotalCounter = true } = {}) {
  const banks = input.split(/\s+/).map(number => parseInt(number, 10));

  const seenConfigurations = {};
  let counter = 0;

  while (true) {
    counter++;
    cycle(banks);

    const key = banks.join(':');

    if (seenConfigurations[key]) {
      return returnTotalCounter ? counter : counter - seenConfigurations[key];
    }

    seenConfigurations[key] = counter;
  }
}

function part2(input) {
  return part1(input, { returnTotalCounter: false });
}

console.log('--- Part 1 ---');
console.log('Test (0 2 7 0):', part1('0 2 7 0') === 5 ? 'OK' : 'FAIL');
console.log('Result:', part1('2 8 8 5 4 2 3 1 5 5 1 2 15 13 5 14'));

console.log('');
console.log('--- Part 2 ---');
console.log('Test (0 2 7 0):', part2('0 2 7 0') === 4 ? 'OK' : 'FAIL');
console.log('Result:', part2('2 8 8 5 4 2 3 1 5 5 1 2 15 13 5 14'));
