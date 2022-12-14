import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./example.txt'))
)

const lines = input.trimEnd().split('\n')

type Point = { x: number; y: number }

const pointSets = lines.map((l) =>
  l.split(' -> ').map((p): Point => {
    const [x, y] = p.split(',').map(Number)
    return { x, y }
  })
)

const minX = Math.min(...pointSets.flat().map((p) => p.x))
const minY = 0
const maxX = Math.max(...pointSets.flat().map((p) => p.x))
const maxY = Math.max(...pointSets.flat().map((p) => p.y))

const grid: string[][] = Array.from({ length: maxY - minY + 1 }, () => {
  return Array.from({ length: maxX - minX + 1 }, () => '.')
})

const spawn: Point = { x: 500 - minX, y: 0 }

for (const points of pointSets) {
  for (let i = 0, j = 1; j < points.length; i++, j++) {
    const p1 = points[i]
    const p2 = points[j]
    const dx = p2.x - p1.x
    const dy = p2.y - p1.y
    const steps = Math.max(Math.abs(dx), Math.abs(dy))
    const xStep = dx / steps
    const yStep = dy / steps
    for (let k = 0; k <= steps; k++) {
      const x = Math.round(p1.x + xStep * k) - minX
      const y = Math.round(p1.y + yStep * k) - minY
      grid[y][x] = '#'
    }
  }
}

const logGrid = () => console.log(grid.map((r) => r.join(' ')).join('\n'))

sand: while (true) {
  const sand = { ...spawn }

  while (true) {
    if (
      sand.x - 1 < 0 ||
      sand.x + 1 >= grid[sand.y].length ||
      sand.y + 1 >= grid.length
    ) {
      break sand
    }

    if (grid[sand.y + 1][sand.x] === '.') {
      sand.y++
    } else if (grid[sand.y + 1][sand.x - 1] === '.') {
      sand.x--
      sand.y++
    } else if (grid[sand.y + 1][sand.x + 1] === '.') {
      sand.x++
      sand.y++
    } else {
      grid[sand.y][sand.x] = 'o'
      break
    }
  }
}

logGrid()
console.log(
  grid.map((r) => r.filter((c) => c === 'o').length).reduce((a, b) => a + b, 0)
)
