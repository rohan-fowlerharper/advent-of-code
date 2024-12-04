import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const grid = input
  .trimEnd()
  .split('\n')
  .map((l) => l.split(''))

const get = (x: number, y: number) => grid[y]?.[x] ?? undefined

type Point = [number, number]

/**
 * check
 */
const c = ([x, y]: Point, letter: string) => get(x, y) === letter

const checkPattern = (x: number, y: number) => {
  const TL: Point = [x - 1, y - 1]
  const TR: Point = [x + 1, y - 1]
  const BL: Point = [x - 1, y + 1]
  const BR: Point = [x + 1, y + 1]

  return (
    (c(TL, 'M') && c(TR, 'M') && c(BR, 'S') && c(BL, 'S')) ||
    (c(TL, 'M') && c(TR, 'S') && c(BR, 'S') && c(BL, 'M')) ||
    (c(TL, 'S') && c(TR, 'S') && c(BR, 'M') && c(BL, 'M')) ||
    (c(TL, 'S') && c(TR, 'M') && c(BR, 'M') && c(BL, 'S'))
  )
}

let total = 0
for (const [y, row] of grid.entries()) {
  for (const [x, cell] of row.entries()) {
    if (cell === 'A') {
      total += Number(checkPattern(x, y))
    }
  }
}

console.log(total)
