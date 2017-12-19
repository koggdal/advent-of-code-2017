function valueOf(registers, value) {
  if (isNaN(value)) {
    return parseInt(registers[value], 10) || 0;
  }
  return parseInt(value, 10);
}

function part1(input) {
  const instructions = input.split('\n');
  const registers = {};

  let lastPlayedFrequency = 0;

  for (let i = 0; i < instructions.length && i >= 0; i++) {
    const [type, register, value] = instructions[i].split(' ');

    if (!(register in registers)) {
      registers[register] = 0;
    }

    switch (type) {
      case 'snd':
        lastPlayedFrequency = registers[register];
        break;

      case 'set':
        registers[register] = valueOf(registers, value);
        break;

      case 'add':
        registers[register] += valueOf(registers, value);
        break;

      case 'mul':
        registers[register] *= valueOf(registers, value);
        break;

      case 'mod':
        registers[register] %= valueOf(registers, value);
        break;

      case 'rcv':
        if (registers[register] !== 0) {
          return lastPlayedFrequency;
        }
        break;

      case 'jgz':
        if (registers[register] > 0) {
          i += valueOf(registers, value);
          i--; // Decrement to counter the loop increment
        }
        break;
    }
  }
}

function* program(id, queues, instructions, sendCounts) {
  const otherId = id === '0' ? '1' : '0';
  const registers = {
    'p': parseInt(id, 10),
  };
  let operationCount = 0;

  for (let i = 0; i < instructions.length && i >= 0; i++, operationCount++) {
    const [type, register, value] = instructions[i].split(' ');

    if (!(register in registers)) {
      registers[register] = 0;
    }

    switch (type) {
      case 'snd':
        queues[otherId].push(valueOf(registers, register));
        sendCounts[id]++;
        break;

      case 'set':
        registers[register] = valueOf(registers, value);
        break;

      case 'add':
        registers[register] += valueOf(registers, value);
        break;

      case 'mul':
        registers[register] *= valueOf(registers, value);
        break;

      case 'mod':
        registers[register] %= valueOf(registers, value);
        break;

      case 'rcv':
        while (queues[id].length === 0) {
          yield operationCount;
        }
        registers[register] = queues[id].shift();
        break;

      case 'jgz':
        if (valueOf(registers, register) > 0) {
          i += valueOf(registers, value);
          i--; // Decrement to counter the loop increment
        }
        break;
    }
  }
}

function part2(input) {
  const instructions = input.split('\n');

  const queues = {
    '0': [],
    '1': [],
  };

  const sendCounts = {
    '0': 0,
    '1': 0,
  };

  const program0 = program('0', queues, instructions, sendCounts);
  const program1 = program('1', queues, instructions, sendCounts);

  let last0Value = 0;
  let last1Value = 0;

  while (true) {
    const {done: is0Done, value: value0} = program0.next();
    const {done: is1Done, value: value1} = program1.next();

    if (is0Done && is1Done) {
      break;
    }

    if (value0 === last0Value && value1 === last1Value) {
      break;
    }

    last0Value = value0;
    last1Value = value1;
  }

  return sendCounts['1'];
}

console.log('--- Part 1 ---');
console.log('Test 1:', part1(`
set a 1
add a 2
mul a a
mod a 5
snd a
set a 0
rcv a
jgz a -1
set a 1
jgz a -2
`.trim()) === 4 ? 'OK' : 'FAIL');
console.log('Result:', part1(getInput()));

console.log('');
console.log('--- Part 2 ---');
console.log('Test 1:', part2(`
snd 1
snd 2
snd p
rcv a
rcv b
rcv c
rcv d
`.trim()) === 3 ? 'OK' : 'FAIL');
console.log('Result:', part2(getInput()));

function getInput() {
  return `
set i 31
set a 1
mul p 17
jgz p p
mul a 2
add i -1
jgz i -2
add a -1
set i 127
set p 952
mul p 8505
mod p a
mul p 129749
add p 12345
mod p a
set b p
mod b 10000
snd b
add i -1
jgz i -9
jgz a 3
rcv b
jgz b -1
set f 0
set i 126
rcv a
rcv b
set p a
mul p -1
add p b
jgz p 4
snd a
set a b
jgz 1 3
snd b
set f 1
add i -1
jgz i -11
snd a
jgz f -16
jgz a -19
`.trim();
}