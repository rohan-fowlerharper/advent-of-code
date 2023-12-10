import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.trimEnd().split('\n')
const grid = lines.map((l) => l.split(''))

type Point = { row: number; col: number }
type StringPoint = `${number},${number}`
const key = (p: Point) => `${p.row},${p.col}` as StringPoint
const dekey = (p: StringPoint) => {
  const [row, col] = p.split(',').map(Number)
  return { row, col }
}

let start: StringPoint | undefined
for (let i = 0; i < grid.length; i++) {
  const row = grid[i]
  for (let j = 0; j < row.length; j++) {
    const char = row[j]
    if (char === 'S') {
      start = key({ row: i, col: j })
    }
  }
}
if (!start) throw 'no start found'

type Dir = Point & {
  dir: 'U' | 'D' | 'L' | 'R'
}
const neighbours = (p: Point) => {
  const { row, col } = p
  const char = grid[row][col]
  return [
    { row: row - 1, col, dir: 'U' },
    { row: row + 1, col, dir: 'D' },
    { row, col: col - 1, dir: 'L' },
    { row, col: col + 1, dir: 'R' },
  ].filter((np) => {
    if (char === 'S') return true
    if (!pipes[char]?.has(np.dir)) return false
    return true
  }) as Dir[]
}

const isPipe = (char: string | undefined) =>
  ['|', '-', 'L', 'J', 'F', '7'].includes(char ?? '')

const pipes: Record<string, Set<string>> = {
  '|': new Set(['U', 'D']),
  '-': new Set(['L', 'R']),
  L: new Set(['U', 'R']),
  J: new Set(['U', 'L']),
  F: new Set(['D', 'R']),
  7: new Set(['D', 'L']),
}

const from = (from: Dir) => {
  const { dir } = from
  switch (dir) {
    case 'U':
      return 'D'
    case 'D':
      return 'U'
    case 'L':
      return 'R'
    case 'R':
      return 'L'
  }
}

let currentPoint = start
let steps = 0
const visited = new Set<StringPoint>()
while (true) {
  const position = dekey(currentPoint)

  const n = neighbours(position)
  const validPipes = n.filter((p) => {
    const char = grid[p.row]?.[p.col]
    return !visited.has(key(p)) && isPipe(char) && pipes[char].has(from(p))
  })

  if (n.map(key).includes(start) && steps !== 1) {
    break
  }

  steps++

  if (!validPipes[0]) throw new Error('no valid neighbour')

  currentPoint = key(validPipes[0])
  visited.add(currentPoint)
}

// find the enclosed area based on the points in `visited`
const maxX = Math.max(...[...visited].map(dekey).map((p) => p.col))
const maxY = Math.max(...[...visited].map(dekey).map((p) => p.row))
const minX = Math.min(...[...visited].map(dekey).map((p) => p.col))
const minY = Math.min(...[...visited].map(dekey).map((p) => p.row))

const enclosed = new Set<StringPoint>()
visited.add(start)
for (let row = minY; row <= maxY; row++) {
  for (let col = minX; col <= maxX; col++) {
    if (visited.has(key({ row, col }))) continue

    // check parity of north-facing pipes to the left
    const left = []
    for (let i = col - 1; i >= minX; i--) {
      const char = grid[row][i]
      if (
        // assumes 'S' is a north facing pipe
        // which it is in my input
        ['|', 'J', 'L', 'S'].includes(char) &&
        visited.has(key({ row, col: i }))
      ) {
        left.push(char)
      }
    }
    if (left.length % 2 !== 0) enclosed.add(key({ row, col }))
  }
}

console.log(enclosed.size)
