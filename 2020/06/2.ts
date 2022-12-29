import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const groups = input
  .trimEnd()
  .split('\n\n')
  .map((g) => g.split('\n').map((l) => l.split('')))

const answer = groups.reduce((total, group) => {
  const appearsInAll = group.reduce((a, b) => {
    const set = new Set(b)
    return a.filter((char) => set.has(char))
  })

  return total + appearsInAll.length
}, 0)

console.log(answer)
