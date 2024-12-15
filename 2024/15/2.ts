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

type Point = { x: number; y: number; width?: number }
const key = ({ x, y }: Point) => `${x},${y}`

const walls = new Set<string>()
const player = { x: 0, y: 0 }

class Box {
  public width: 2
  constructor(public x: number, public y: number, public id: number) {
    this.x = x
    this.y = y
    this.width = 2
    this.id = id
  }

  collides(point: Point) {
    return (
      this.x < point.x + (point.width ?? 1) &&
      this.x + this.width > point.x &&
      this.y < point.y + 1 &&
      this.y >= point.y
    )
  }

  points() {
    return [
      { x: this.x, y: this.y },
      { x: this.x + 1, y: this.y },
    ]
  }
}

const dekey = (key: string): Point => {
  const [x, y] = key.split(',').map(Number)
  return { x, y }
}

const boxes = new Map<number, Box>()

grid.forEach((row, y) => {
  row.forEach((cell, x) => {
    switch (cell) {
      case '#':
        walls.add(key({ x: x * 2, y }))
        walls.add(key({ x: x * 2 + 1, y }))
        break
      case 'O': {
        boxes.set(boxes.size, new Box(x * 2, y, boxes.size))
        break
      }
      case '@':
        player.x = x * 2
        player.y = y
        break
    }
  })
})

const width = grid[0].length * 2
const height = grid.length

const moves = movesRaw.replaceAll('\n', '').split('') as (
  | '<'
  | '>'
  | '^'
  | 'v'
)[]

const getWallColission = (point: Point | Point[]) => {
  const points = Array.isArray(point) ? point : [point]
  for (const p of points) {
    if (walls.has(key(p))) {
      return true
    }
  }
  return false
}

const getBoxColission = (point: Point) => {
  for (const box of boxes.values()) {
    if (box.collides(point)) {
      return box
    }
  }
  return null
}

moves: for (const move of moves) {
  const [dx, dy] = dirs[move]
  const next = { x: player.x + dx, y: player.y + dy }

  if (getWallColission(next)) continue
  const box = getBoxColission(next)

  if (!box) {
    player.x = next.x
    player.y = next.y
    continue
  }

  const movedBoxes = []
  const queue = [new Box(box.x + dx, box.y + dy, box.id)]
  while (queue.length) {
    const current = queue.shift()!

    if (getWallColission(current.points())) {
      continue moves
    }

    // do not include self
    const collidingBoxes = Array.from(boxes.values()).filter(
      (b) => b.collides(current) && b.id !== current.id
    )

    for (const b of collidingBoxes) {
      queue.push(new Box(b.x + dx, b.y + dy, b.id))
    }

    movedBoxes.push(current)
  }

  player.x = next.x
  player.y = next.y

  for (const b of movedBoxes) {
    boxes.set(b.id, b)
  }
}

function _printGrid(move: string, i?: number) {
  console.log('\n\n')
  console.log(move, i)

  const grid = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => '.')
  )

  walls.forEach((wall) => {
    const { x, y } = dekey(wall)
    grid[y][x] = '#'
  })

  boxes.forEach((box) => {
    grid[box.y][box.x] = '['
    grid[box.y][box.x + 1] = ']'
  })

  grid[player.y][player.x] = '@'

  grid.forEach((row) => {
    console.log(row.join(''))
  })
}

const result = [...boxes.values()].reduce((total, box) => {
  const { x, y } = box
  return total + x + 100 * y
}, 0)

console.log(result)
