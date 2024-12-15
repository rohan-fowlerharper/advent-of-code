import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const [gridRaw, movesRaw] = input.trimEnd().split('\n\n')

const dirs = {
  '<': [-1, 0],
  '>': [1, 0],
  '^': [0, -1],
  v: [0, 1],
}

const grid = gridRaw.split('\n').map((line) => line.split(''))

type Point = { x: number; y: number }
const key = ({ x, y }: Point) => `${x},${y}`
const boxes = new Set<string>()
const walls = new Set<string>()
const player = { x: 0, y: 0 }

grid.forEach((row, y) => {
  row.forEach((cell, x) => {
    switch (cell) {
      case '#':
        walls.add(key({ x, y }))
        break
      case 'O':
        boxes.add(key({ x, y }))
        break
      case '@':
        player.x = x
        player.y = y
        break
    }
  })
})

const width = grid[0].length
const height = grid.length

const moves = movesRaw.replaceAll('\n', '').split('') as (
  | '<'
  | '>'
  | '^'
  | 'v'
)[]

for (const move of moves) {
  const [dx, dy] = dirs[move]
  const next = key({ x: player.x + dx, y: player.y + dy })

  if (walls.has(next)) continue

  if (!boxes.has(next)) {
    player.x += dx
    player.y += dy
    continue
  }

  let steps = 2
  while (true) {
    const nextBox = key({ x: player.x + dx * steps, y: player.y + dy * steps })
    if (walls.has(nextBox)) break

    // found a free spot for a box
    if (!boxes.has(nextBox)) {
      boxes.delete(next)
      boxes.add(nextBox)
      player.x += dx
      player.y += dy
      break
    }

    steps++
  }
}

function _printGrid(move: string) {
  console.log(move)
  for (let y = 0; y < height; y++) {
    let row = ''
    for (let x = 0; x < width; x++) {
      const point = key({ x, y })
      if (player.x === x && player.y === y) {
        row += '@'
      } else if (walls.has(point)) {
        row += '#'
      } else if (boxes.has(point)) {
        row += 'O'
      } else {
        row += '.'
      }
    }
    console.log(row)
  }
}

const dekey = (key: string): Point => {
  const [x, y] = key.split(',').map(Number)
  return { x, y }
}

const result = [...boxes].reduce((total, box) => {
  const { x, y } = dekey(box)
  return total + x + 100 * y
}, 0)

console.log(result)
