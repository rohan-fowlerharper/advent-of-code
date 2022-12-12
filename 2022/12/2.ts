import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.trimEnd().split('\n')

type Point = { x: number; y: number }
let end: Point = { x: 0, y: 0 }
const grid = lines.map((line) => line.split(''))

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] === 'S') grid[y][x] = 'a'
    if (grid[y][x] === 'E') {
      end = { x, y }
      grid[y][x] = 'z'
    }
  }
}

const alphabet = 'abcdefghijklmnopqrstuvwxyz'
const dirs: { x: number; y: number }[] = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
]
const visited = new Set<string>()

const q: [number, Point][] = [[0, end]]

while (q.length > 0) {
  const [steps, { x, y }] = q.shift()!

  for (const { nx, ny } of dirs.map((dir) => ({
    nx: x + dir.x,
    ny: y + dir.y,
  }))) {
    if (nx < 0 || ny < 0 || nx >= grid[0].length || ny >= grid.length) continue
    if (visited.has(`${nx},${ny}`)) continue
    if (alphabet.indexOf(grid[ny][nx]) - alphabet.indexOf(grid[y][x]) < -1)
      continue

    if (grid[ny][nx] === 'a') {
      throw steps + 1
    }

    q.push([steps + 1, { x: nx, y: ny }])
    visited.add(`${nx},${ny}`)
  }
}
