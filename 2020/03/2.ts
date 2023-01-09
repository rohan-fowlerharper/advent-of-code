import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

performance.mark('start')

const grid = input
  .trimEnd()
  .split('\n')
  .map((l) => l.split(''))

performance.mark('parsed')

const traverse = (right: number, down: number) => {
  let count = 0
  for (let h = down, steps = 1; h < grid.length; h += down, steps++) {
    const isTree = grid[h][(steps * right) % grid[0].length] === '#'

    if (isTree) count++
  }
  return count
}

const traversals = [
  traverse(1, 1),
  traverse(3, 1),
  traverse(5, 1),
  traverse(7, 1),
  traverse(1, 2),
]

const result = traversals.reduce((a, b) => a * b, 1)

performance.mark('end')

console.log(result)

console.log(
  `To parse: ${performance
    .measure('03.2', 'start', 'parsed')
    .duration.toFixed(3)}ms`
)

console.log(
  `To solve: ${performance
    .measure('03.2', 'parsed', 'end')
    .duration.toFixed(3)}ms`
)
