import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

type Coord = {
  x: number
  y: number
  z: number
}
type Key = `${Coord['x']},${Coord['y']},${Coord['z']}`
const cubes = input
  .trimEnd()
  .split('\n')
  .map((l) => {
    const [x, y, z] = l.split(',').map(Number)
    return { x, y, z }
  })

const cubeSet = new Set(input.trimEnd().split('\n')) as Set<Key>

const dirs = [
  [0, 1, 0],
  [1, 0, 0],
  [0, -1, 0],
  [-1, 0, 0],
  [0, 0, 1],
  [0, 0, -1],
]

const key = (c: Coord): Key => `${c.x},${c.y},${c.z}`

let area = 0
for (const c of cubes) {
  for (const [dx, dy, dz] of dirs) {
    const next = { x: c.x + dx, y: c.y + dy, z: c.z + dz }
    if (!cubeSet.has(key(next))) {
      area++
    }
  }
}

console.log(area)
