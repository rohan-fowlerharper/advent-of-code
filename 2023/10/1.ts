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
    // is in bounds
    if (np.row < 0 || np.row >= grid.length) return false
    if (np.col < 0 || np.col >= grid[np.row].length) return false

    if (char === 'S') return true
    if (!pipes[char]?.has(np.dir)) return false
    return true
  }) as Dir[]
}

const isPipe = (char: string) => ['|', '-', 'L', 'J', 'F', '7'].includes(char)

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

  // check all the neighbours and find the one that connects (and is not the one we just came from)
  const n = neighbours(position)
  const validPipes = n.filter((p) => {
    const char = grid[p.row][p.col]

    return isPipe(char) && !visited.has(key(p)) && pipes[char].has(from(p))
  })

  const keyedNeighbours = n.map(key)
  if (keyedNeighbours.includes(start) && steps !== 1) {
    console.log((steps + 1) / 2)
    break
  }

  steps++

  if (!validPipes[0]) throw new Error('no valid neighbour')

  currentPoint = key(validPipes[0])
  visited.add(currentPoint)
}
