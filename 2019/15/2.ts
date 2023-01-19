import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'
import createComputer from './computer.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const stream = input.trimEnd().replace('\n', '').split(',').map(Number)

const run = createComputer([...stream])

type Dir = 1 | 2 | 3 | 4
const dirs = {
  1: { dx: 0, dy: -1 },
  2: { dx: 0, dy: 1 },
  3: { dx: -1, dy: 0 },
  4: { dx: 1, dy: 0 },
} as const

type Point = { x: number; y: number }

// dfs with backtracking to map out the maze
const maze = new Map<string, number>()
const key = (p: Point) => `${p.x},${p.y}`

const stack: { curr: Point; moves: Dir[] }[] = []

const start = { curr: { x: 0, y: 0 }, moves: [] }

maze.set(key(start.curr), 1)

stack.push(start)

const _print = (maze: Map<string, number>, p: Point) => {
  const minX = Math.min(
    ...[...maze.keys()].map((k) => k.split(',').map(Number)[0])
  )
  const maxX = Math.max(
    ...[...maze.keys()].map((k) => k.split(',').map(Number)[0])
  )
  const minY = Math.min(
    ...[...maze.keys()].map((k) => k.split(',').map(Number)[1])
  )
  const maxY = Math.max(
    ...[...maze.keys()].map((k) => k.split(',').map(Number)[1])
  )

  for (let y = minY; y <= maxY; y++) {
    let row = ''
    for (let x = minX; x <= maxX; x++) {
      const tile = maze.get(`${x},${y}`) ?? 3
      if (x === 0 && y === 0) {
        row += 'S'
        continue
      }
      if (x === p.x && y === p.y) {
        row += 'X'
        continue
      }
      switch (tile) {
        case 0:
          row += '█'
          break
        case 1:
          row += '.'
          break
        case 2:
          row += 'O'
          break
        case 3:
          row += ' '
          break
      }
    }
    console.log(row)
  }
}

// dfs with backtracking, using the run command to backtrack from last location
while (stack.length > 0) {
  const { curr, moves } = stack.pop()!

  let viableMoves = 0
  const neighbours = Object.entries(dirs)
    .map(([dir, { dx, dy }]) => {
      const next = { x: curr.x + dx, y: curr.y + dy }

      return { next, dir: Number(dir) as Dir }
    })
    .filter(({ next }) => {
      const nextKey = key(next)
      if (maze.has(nextKey)) return false
      viableMoves++
      return true
    })

  // _print(maze, curr)
  // console.log('------------------------')
  // console.log('\n\n\n')

  if (viableMoves === 0) {
    const lastMove = moves[moves.length - 1]
    if (!lastMove) break
    const reverse = {
      1: 2,
      2: 1,
      3: 4,
      4: 3,
    }
    const { output } = run(reverse[lastMove])
    // const { output } = run(lastMove)

    if (output === 0) throw new Error('backtracking failed')

    // console.log('pushed', moves.slice(0, -1))
    stack.push({
      curr: {
        x: curr.x - dirs[lastMove].dx,
        y: curr.y - dirs[lastMove].dy,
      },
      moves: moves.slice(0, -1),
    })
    continue
  } else {
    const { next, dir } = neighbours[0]
    const { output } = run(dir)
    maze.set(key(next), output)
    if (output !== 0) {
      stack.push({ curr: next, moves: [...moves, dir] })
    } else {
      stack.push({
        curr,
        moves,
      })
    }
  }
}

// _print(maze)

// bfs to find the shortest path to the oxygen system

const oxygen = [...maze.entries()].find(([_, v]) => v === 2)!
const oxygenPoint: Point = {
  x: Number(oxygen[0].split(',')[0]),
  y: Number(oxygen[0].split(',')[1]),
}

const queue: { curr: Point; moves: number }[] = []
queue.push({ curr: oxygenPoint, moves: 0 })

const visited = new Set<string>([oxygen[0]])

let totalMoves = 0
while (queue.length > 0) {
  const { curr, moves } = queue.shift()!

  const neighbours = Object.values(dirs).map(({ dx, dy }) => {
    return { x: curr.x + dx, y: curr.y + dy }
  })

  for (const next of neighbours) {
    const nextKey = key(next)

    if (visited.has(nextKey)) continue
    visited.add(nextKey)

    if (maze.get(nextKey) === 1) {
      maze.set(nextKey, 2)
      totalMoves = Math.max(totalMoves, moves + 1)
      queue.push({ curr: next, moves: moves + 1 })
    }
  }
}

console.log(totalMoves)
