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

const dirs = [
  [0, 1, 0],
  [1, 0, 0],
  [0, -1, 0],
  [-1, 0, 0],
  [0, 0, 1],
  [0, 0, -1],
]

const cubes: Coord[] = input
  .trimEnd()
  .split('\n')
  .map((l) => {
    const [x, y, z] = l.split(',').map(Number)
    return { x, y, z }
  })
const cubeSet = new Set(input.trimEnd().split('\n')) as Set<Key>

const minX = Math.min(...cubes.map((c) => c.x)) - 1
const maxX = Math.max(...cubes.map((c) => c.x)) + 1
const minY = Math.min(...cubes.map((c) => c.y)) - 1
const maxY = Math.max(...cubes.map((c) => c.y)) + 1
const minZ = Math.min(...cubes.map((c) => c.z)) - 1
const maxZ = Math.max(...cubes.map((c) => c.z)) + 1

const isOutOfBounds = (c: Coord) =>
  c.x < minX ||
  c.x > maxX ||
  c.y < minY ||
  c.y > maxY ||
  c.z < minZ ||
  c.z > maxZ
const key = (c: Coord): Key => `${c.x},${c.y},${c.z}`
const queue = [{ x: minX, y: minY, z: minZ }]
const visited = new Set<string>()

let area = 0
while (queue.length > 0) {
  const c = queue.shift()!

  if (visited.has(key(c))) continue
  visited.add(key(c))

  for (const [dx, dy, dz] of dirs) {
    const next = { x: c.x + dx, y: c.y + dy, z: c.z + dz }

    if (isOutOfBounds(next)) continue

    if (cubeSet.has(key(next))) {
      area++
    } else {
      queue.push(next)
    }
  }
}

console.log(area)
