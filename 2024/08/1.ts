import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input
  .trimEnd()
  .split('\n')
  .map((l) => l.split(''))

type Point = { x: number; y: number }

const nodes = new Map<string, Point[]>()
const antinodes = new Set<string>()
for (const [y, line] of lines.entries()) {
  for (const [x, char] of line.entries()) {
    if (char !== '.') {
      nodes.set(char, (nodes.get(char) ?? []).concat({ x, y }))
    }
  }
}

const width = lines[0].length
const height = lines.length

const isOutOfBounds = (x: number, y: number) =>
  x < 0 || y < 0 || x >= width || y >= height

for (const [_, points] of nodes) {
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const a = points[i]
      const b = points[j]

      const anti1 = { x: 2 * a.x - b.x, y: 2 * a.y - b.y }
      const anti2 = { x: 2 * b.x - a.x, y: 2 * b.y - a.y }

      if (!isOutOfBounds(anti1.x, anti1.y)) {
        antinodes.add(`${anti1.x},${anti1.y}`)
      }

      if (!isOutOfBounds(anti2.x, anti2.y)) {
        antinodes.add(`${anti2.x},${anti2.y}`)
      }
    }
  }
}

console.log(antinodes.size)

function _printGrid() {
  const tmp = [...lines.map((l) => [...l])]
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (antinodes.has(`${x},${y}`) && tmp[y][x] === '.') {
        tmp[y][x] = '#'
      }
    }
  }
  console.log(tmp.map((l) => l.join('')).join('\n'))
}
