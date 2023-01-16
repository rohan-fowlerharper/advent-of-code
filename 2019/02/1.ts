import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const numbers = input.trimEnd().split('\n')[0].split(',').map(Number)

numbers[1] = 12
numbers[2] = 2

for (let i = 0; numbers[i] !== 99; i += 4) {
  const op = numbers[i]
  const a = numbers[numbers[i + 1]]
  const b = numbers[numbers[i + 2]]
  const c = numbers[i + 3]

  if (op === 1) numbers[c] = a + b
  else if (op === 2) numbers[c] = a * b
}

console.log(numbers[0])
