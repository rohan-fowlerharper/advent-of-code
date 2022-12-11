import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

type Cell = {
  value: number
  flashed: Set<number>
}

type Coord = [number, number]

const g: Cell[][] = input
  .trimEnd()
  .split('\n')
  .map((l) =>
    l.split('').map((n) => ({ value: Number(n), flashed: new Set<number>() }))
  )

const dirs = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
  [1, 1],
  [-1, 1],
  [-1, -1],
  [1, -1],
]

let flashed = 0
for (let step = 1; step <= 100; step++) {
  for (let y = 0; y < g.length; y++) {
    for (let x = 0; x < g[y].length; x++) {
      const flashCell = (cell: Cell) => {
        cell.flashed.add(step)
        cell.value = 0
        flashed++
      }

      const processCell = ([x, y]: Coord) => {
        const cell = g[y]?.[x] || null
        if (!cell || cell.flashed.has(step)) return

        cell.value++

        if (cell.value > 9) {
          flashCell(cell)
          incNeighbours([x, y])
        }
      }

      const incNeighbours = ([x, y]: Coord) => {
        for (const [dx, dy] of dirs) {
          const nx = x + dx
          const ny = y + dy
          processCell([nx, ny])
        }
      }

      processCell([x, y])
    }
  }
}

console.log(flashed)
