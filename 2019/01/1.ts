import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.trimEnd().split('\n').map(Number)

const result = lines.reduce((acc, n) => {
  return acc + (Math.floor(n / 3) - 2)
}, 0)

console.log(result)
