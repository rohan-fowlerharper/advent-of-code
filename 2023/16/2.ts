import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.trimEnd().split('\n')

const map: ObjectMap = new Map()
const set = (x: number, y: number, value: Object) => map.set(`${x},${y}`, value)
const get = (x: number, y: number): Object | undefined => map.get(`${x},${y}`)

for (const [y, line] of lines.entries()) {
  for (const [x, char] of line.split('').entries()) {
    if (['|', '-', '/', '\\'].includes(char)) {
      set(x, y, char as Object)
    }
  }
}

type Point = { x: number; y: number; dir: Direction }
type StringPoint = `${number},${number}`
type StringPointWithDir = `${number},${number},${Direction}`
type Object = '|' | '-' | '/' | '\\'
type ObjectMap = Map<StringPoint, Object>
type Direction = 'up' | 'down' | 'left' | 'right'

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

const bounds = {
  minX: 0,
  maxX: lines[0].length - 1,
  minY: 0,
  maxY: lines.length - 1,
}

const getOutput = (x: number, y: number, dir: Direction): number => {
  const visited = new Set<StringPointWithDir>()
  const energised = new Set<StringPoint>()
  const stack: Point[] = []

  const enqueue = (x: number, y: number, dir: Direction) =>
    stack.push({ x, y, dir: dir })

  const dequeue = (): Point | undefined => stack.shift()

  enqueue(x, y, dir)
  while (stack.length > 0) {
    const { x, y, dir } = dequeue()!
    const [dx, dy] = getDiff(dir)
    const object = get(x, y)

    if (visited.has(`${x},${y},${dir}`)) {
      continue
    }

    if (
      x < bounds.minX ||
      x > bounds.maxX ||
      y < bounds.minY ||
      y > bounds.maxY
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

  return energised.size
}

let max = 0
for (let i = 0; i < lines[0].length; i++) {
  const top = getOutput(i, 0, 'down')
  const bottom = getOutput(i, lines.length - 1, 'up')
  max = Math.max(max, top, bottom)
}

for (let i = 0; i < lines.length; i++) {
  const left = getOutput(0, i, 'right')
  const right = getOutput(lines[0].length - 1, i, 'left')
  max = Math.max(max, left, right)
}

console.log(max)
