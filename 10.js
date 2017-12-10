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

function part1(input, listLength = 256) {
  const list = new Array(listLength).fill(1).map((item, index) => index);
  const lengths = input.split(/,\s*/).map(length => parseInt(length, 10));

  const state = {
    currentPosition: 0,
    skipSize: 0,
  };

  runRound({
    list,
    lengths,
    state,
  });

  return list[0] * list[1];
}

function part2(input, listLength = 256) {
  const list = new Array(listLength).fill(1).map((item, index) => index);
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

  for (let i = 0; i < listLength + 1; i++) {
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

console.log('--- Part 1 ---');
console.log('Test 1:', part1('3, 4, 1, 5', 5) === 12 ? 'OK' : 'FAIL');
console.log('Result:', part1(getInput()));

console.log('');
console.log('--- Part 2 ---');
console.log('Test 1:', part2('') === 'a2582a3a0e66e6e86e3812dcb672a272' ? 'OK' : 'FAIL');
console.log('Test 2:', part2('AoC 2017') === '33efeb34ea91902bb2f59c9920caa6cd' ? 'OK' : 'FAIL');
console.log('Test 3:', part2('1,2,3') === '3efbe78a8d82f29979031a4aa0b16a9d' ? 'OK' : 'FAIL');
console.log('Test 4:', part2('1,2,4') === '63960835bcdc130f0b66d7ff4f6a5a8e' ? 'OK' : 'FAIL');
console.log('Result:', part2(getInput()));

function getInput() {
  return '212,254,178,237,2,0,1,54,167,92,117,125,255,61,159,164';
}
