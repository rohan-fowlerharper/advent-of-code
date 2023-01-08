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

const dirs = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
  [-1, -1],
  [1, 1],
  [-1, 1],
  [1, -1],
]

type Point = { x: number; y: number }
type Coord = `${number},${number}`

const key = (p: Point): Coord => `${p.x},${p.y}`

const isOccupied = (p: Point) => grid[p.y][p.x] === '#'
const isFloor = (p: Point) => grid[p.y][p.x] === '.'
const isOutOfBounds = (p: Point) =>
  p.x < 0 || p.y < 0 || p.x >= grid[0].length || p.y >= grid.length

const getNeighbourCounts = (p: Point) => {
  let occupied = 0

  for (const [dx, dy] of dirs) {
    const next = { x: p.x + dx, y: p.y + dy }

    if (isOutOfBounds(next)) continue
    if (isOccupied(next)) occupied++
  }

  return occupied
}

const shouldChange = (p: Point, currentlyOccupied: boolean) => {
  const occupiedNeighbours = getNeighbourCounts(p)

  if (currentlyOccupied && occupiedNeighbours >= 4) return true
  if (!currentlyOccupied && occupiedNeighbours === 0) return true

  return false
}

while (true) {
  const seatsToChange = new Map<Coord, Point>()

  let moves = 0
  for (const [y, row] of grid.entries()) {
    for (const [x, char] of row.entries()) {
      const p = { x, y }

      if (isFloor(p)) continue

      const currentlyOccupied = char === '#'

      if (shouldChange(p, currentlyOccupied)) {
        seatsToChange.set(key(p), p)
        moves++
      }
    }
  }

  for (const p of seatsToChange.values()) {
    grid[p.y][p.x] = isOccupied(p) ? 'L' : '#'
  }

  if (moves === 0) break
}

const result = grid.flat().filter((c) => c === '#').length

performance.mark('end')
console.log(result)

console.log(
  `To parse: ${performance
    .measure('11.1', 'start', 'parsed')
    .duration.toFixed(3)}ms`
)

console.log(
  `To solve: ${performance
    .measure('11.1', 'parsed', 'end')
    .duration.toFixed(3)}ms`
)
