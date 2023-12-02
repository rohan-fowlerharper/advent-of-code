import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

// since words can overlap one letter
// keep the first and last letter of each
// word representation
const numbersAsWords = {
  o1e: 'one',
  t2o: 'two',
  t3e: 'three',
  f4r: 'four',
  f5e: 'five',
  s6x: 'six',
  s7n: 'seven',
  e8t: 'eight',
  n9e: 'nine',
}

const lines = input
  .trimEnd()
  .split('\n')
  .map((l) => {
    Object.entries(numbersAsWords).forEach(([number, word]) => {
      l = l.replaceAll(word, number)
    })
    return l
  })
  .map((l) => l.split('').filter(Number))
  .map((l) => l[0] + l.at(-1))
  .map(Number)
  .reduce((a, b) => a + b, 0)

console.log(lines)
