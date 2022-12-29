import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const grid = input
  .trimEnd()
  .split('\n')
  .map((l) => {
    return l.split('')
  })

let count = 0
for (let h = 1; h < grid.length; h++) {
  const isTree = grid[h][(h * 3) % grid[0].length] === '#'

  if (isTree) {
    count++
  }
}

console.log(count)
