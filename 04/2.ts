import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.split('\n')

let total = 0
for (const line of lines) {
  if (line === '') continue
  const [one, two] = line.split(',')

  const [oneStart, oneEnd] = one.split('-').map(Number)
  const [twoStart, twoEnd] = two.split('-').map(Number)
  const isOverlap = oneStart <= twoEnd && twoStart <= oneEnd

  if (isOverlap) {
    total++
  }
}

console.log(total)
