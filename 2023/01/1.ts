import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input
  .trimEnd()
  .split('\n')
  .map((l) => l.split('').filter(Number))
  .map((l) => l[0] + l.at(-1))
  .map(Number)
  .reduce((a, b) => a + b, 0)

console.table(lines)
