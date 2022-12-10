import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.split('\n').map((l) =>
  l
    .split(' | ')[1]
    .split(' ')
    .map((n) => n.length)
)
const easyNums = [3, 4, 7, 2]
let unique = 0

for (const line of lines) {
  unique += line.reduce((t, n) => (easyNums.includes(n) ? t + 1 : t), 0)
}

console.log(unique)
