import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

performance.mark('start')

const grid = input
  .trimEnd()
  .split('\n')
  .map((l) => {
    return l.split('')
  })

performance.mark('parsed')

let count = 0
for (let h = 1; h < grid.length; h++) {
  const isTree = grid[h][(h * 3) % grid[0].length] === '#'

  if (isTree) {
    count++
  }
}

performance.mark('end')

console.log(count)

console.log(
  `To parse: ${performance
    .measure('03.1', 'start', 'parsed')
    .duration.toFixed(3)}ms`
)

console.log(
  `To solve: ${performance
    .measure('03.1', 'parsed', 'end')
    .duration.toFixed(3)}ms`
)
