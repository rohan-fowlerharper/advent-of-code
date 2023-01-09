import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

performance.mark('start')

const numbers = input.trimEnd().split(',').map(Number)

performance.mark('parsed')

const lastSpokenMap = new Map<number, number>()

const lastSpoken = Array(2020)

for (let i = 0; i < numbers.length; i++) {
  lastSpokenMap.set(numbers[i], i)
  lastSpoken[numbers[i]] = i
}

let lastNumber = numbers[numbers.length - 1]

for (let n = numbers.length; n < 2020; n++) {
  const position = n - 1
  const lastTimeSpoken = lastSpoken[lastNumber] ?? position
  const nextNumber = position - lastTimeSpoken

  lastSpoken[lastNumber] = position

  lastNumber = nextNumber
}

performance.mark('end')

console.log(lastNumber)

console.log(
  `To parse: ${performance
    .measure('15.1', 'start', 'parsed')
    .duration.toFixed(3)}ms`
)

console.log(
  `To solve: ${performance
    .measure('15.1', 'parsed', 'end')
    .duration.toFixed(3)}ms`
)
