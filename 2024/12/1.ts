import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.trimEnd().split('\n')

const regions = new Map<string, { area: number; perimeter: number }>()

function createRegion(
  lines: string[],
  visited: Set<string>,
  y: number,
  x: number,
  letter: string
) {
  const stack = [[y, x]]
  let area = 0
  let perimeter = 0

  while (stack.length > 0) {
    const [cy, cx] = stack.pop()!
    if (visited.has(key(cy, cx))) continue
    visited.add(key(cy, cx))
    area++

    for (const [ny, nx] of getNeighbours(cy, cx)) {
      if (isOutOfBounds(ny, nx) || lines[ny][nx] !== letter) {
        perimeter += 1
      } else {
        stack.push([ny, nx])
      }
    }
  }

  return { area, perimeter }
}

const getNeighbours = (y: number, x: number) => {
  return [
    [y - 1, x],
    [y + 1, x],
    [y, x - 1],
    [y, x + 1],
  ]
}

const isOutOfBounds = (y: number, x: number) =>
  y < 0 || y >= lines.length || x < 0 || x >= lines[0].length

const visited = new Set<string>()
const key = (y: number, x: number) => `${y},${x}`

for (let y = 0; y < lines.length; y++) {
  for (let x = 0; x < lines[y].length; x++) {
    const letter = lines[y][x]
    if (visited.has(key(y, x))) continue

    const region = createRegion(lines, visited, y, x, letter)

    regions.set(key(y, x), region)
  }
}

const result = Array.from(regions.values())
  .map((region) => region.area * region.perimeter)
  .reduce((a, b) => a + b, 0)

console.log(result)
