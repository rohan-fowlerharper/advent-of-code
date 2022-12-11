import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const monkeys = input
  .trimEnd()
  .split('\n\n')
  .map((monkeyLines) => {
    return monkeyLines.split('\n')
  })
  .map((monkey, i) => {
    const [, lStartingItems, lOperation, lTest, ifTrue, ifFalse] = monkey

    return {
      num: i,
      startingItems: lStartingItems.split(': ')[1].split(', ').map(Number),
      operation: lOperation
        .split(': ')[1]
        .split('new = ')[1]
        .replaceAll('old', '_old'),
      test: Number(lTest.split(' ').at(-1)),
      ifTrue: Number(ifTrue.split(' ').at(-1)),
      ifFalse: Number(ifFalse.split(' ').at(-1)),
      inspections: 0,
    }
  })

for (let round = 1; round <= 20; round++) {
  for (const monkey of monkeys) {
    const { startingItems, operation, test, ifTrue, ifFalse } = monkey

    while (startingItems.length > 0) {
      const _old = monkey.startingItems.shift()

      monkey.inspections++

      let newWorryLevel = eval(operation)
      newWorryLevel = Math.floor(newWorryLevel / 3)

      const nextMonkey =
        newWorryLevel % test === 0 ? monkeys[ifTrue] : monkeys[ifFalse]

      nextMonkey.startingItems.push(newWorryLevel)
    }
  }
}

console.log(
  monkeys
    .map((m) => m.inspections)
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((a, b) => a * b)
)
