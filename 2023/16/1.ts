import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.trimEnd().split('\n')

const map: ObjectMap = new Map()

const set = (x: number, y: number, value: Object) => map.set(`${x},${y}`, value)

for (const [y, line] of lines.entries()) {
  for (const [x, char] of line.split('').entries()) {
    if (['|', '-', '/', '\\'].includes(char)) {
      set(x, y, char as Object)
    }
  }
}

console.log(map)

type Point = { x: number; y: number; dir: Direction }
type StringPoint = `${number},${number}`
type StringPointWithDir = `${number},${number},${Direction}`
type Object = '|' | '-' | '/' | '\\'
type ObjectMap = Map<StringPoint, Object>
type Direction = 'up' | 'down' | 'left' | 'right'

const stack: Point[] = []

const get = (x: number, y: number): Object | undefined => map.get(`${x},${y}`)

const enqueue = (x: number, y: number, dir: Direction) =>
  stack.push({ x, y, dir: dir })

const dequeue = (): Point | undefined => stack.shift()

const visited = new Set<StringPointWithDir>()
const energised = new Set<StringPoint>()

const getDiff = (dir: Direction): [number, number] => {
  switch (dir) {
    case 'up':
      return [0, -1]
    case 'down':
      return [0, 1]
    case 'left':
      return [-1, 0]
    case 'right':
      return [1, 0]
  }
}

const BOUNDS = {
  minX: 0,
  maxX: lines[0].length - 1,
  minY: 0,
  maxY: lines.length - 1,
}

enqueue(0, 0, 'right')
while (stack.length > 0) {
  const { x, y, dir } = dequeue()!
  const [dx, dy] = getDiff(dir)
  const object = get(x, y)

  if (visited.has(`${x},${y},${dir}`)) {
    continue
  }

  if (
    x < BOUNDS.minX ||
    x > BOUNDS.maxX ||
    y < BOUNDS.minY ||
    y > BOUNDS.maxY
  ) {
    continue
  }

  visited.add(`${x},${y},${dir}`)
  energised.add(`${x},${y}`)

  if (object === undefined) {
    enqueue(x + dx, y + dy, dir)
    continue
  }

  if (object === '|') {
    if (dir === 'up' || dir === 'down') {
      enqueue(x, y + dy, dir)
    } else {
      enqueue(x, y + 1, 'down')
      enqueue(x, y - 1, 'up')
    }
  }

  if (object === '-') {
    if (dir === 'left' || dir === 'right') {
      enqueue(x + dx, y, dir)
    } else {
      enqueue(x + 1, y, 'right')
      enqueue(x - 1, y, 'left')
    }
  }

  if (object === '/') {
    if (dir === 'up') {
      enqueue(x + 1, y, 'right')
    } else if (dir === 'down') {
      enqueue(x - 1, y, 'left')
    } else if (dir === 'left') {
      enqueue(x, y + 1, 'down')
    } else {
      enqueue(x, y - 1, 'up')
    }
  }

  if (object === '\\') {
    if (dir === 'up') {
      enqueue(x - 1, y, 'left')
    } else if (dir === 'down') {
      enqueue(x + 1, y, 'right')
    } else if (dir === 'left') {
      enqueue(x, y - 1, 'up')
    } else {
      enqueue(x, y + 1, 'down')
    }
  }
}

console.log(energised.size)
