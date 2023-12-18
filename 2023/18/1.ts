import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input
  .trimEnd()
  .split('\n')
  .map((l) => {
    const [direction, distance, color] = l.split(' ')

    return {
      direction: direction as Direction,
      distance: Number(distance),
      color,
    }
  })

type Direction = 'U' | 'D' | 'L' | 'R'
const getDiff = (direction: Direction): [number, number] => {
  switch (direction) {
    case 'U':
      return [0, -1]
    case 'D':
      return [0, 1]
    case 'L':
      return [-1, 0]
    case 'R':
      return [1, 0]
  }
}

const pos = { x: 0, y: 0 }

type Point = { x: number; y: number }
type StringPoint = `${number},${number}`
const blocks = new Set<StringPoint>()
for (const line of lines) {
  const [dx, dy] = getDiff(line.direction)

  for (let i = 0; i < line.distance; i++) {
    pos.x += dx
    pos.y += dy
    blocks.add(`${pos.x},${pos.y}`)
  }
}

const BOUNDS = {
  maxX: Math.max(...[...blocks.keys()].map((k) => Number(k.split(',')[0]))) + 1,
  maxY: Math.max(...[...blocks.keys()].map((k) => Number(k.split(',')[1]))) + 1,
  minX: Math.min(...[...blocks.keys()].map((k) => Number(k.split(',')[0]))) - 1,
  minY: Math.min(...[...blocks.keys()].map((k) => Number(k.split(',')[1]))) - 1,
}

const isOutOfBounds = ({ x, y }: Point) =>
  x < BOUNDS.minX || x > BOUNDS.maxX || y < BOUNDS.minY || y > BOUNDS.maxY

const queue: Point[] = [{ x: BOUNDS.minX, y: BOUNDS.minY }]
const visited = new Set<StringPoint>()

while (queue.length) {
  const { x, y } = queue.shift()!
  const key = `${x},${y}` as StringPoint
  if (visited.has(key) || blocks.has(key) || isOutOfBounds({ x, y })) continue
  visited.add(key)

  queue.push({ x: x + 1, y }, { x: x - 1, y }, { x, y: y + 1 }, { x, y: y - 1 })
}

const area =
  Math.abs(BOUNDS.maxX - BOUNDS.minX + 1) *
  Math.abs(BOUNDS.maxY - BOUNDS.minY + 1)

console.log(area - visited.size)
// console.log(count)

// use the numbers 38, 46, and 96 to get 62

// console.log(count)
// console.log(blocks.size)
// const area =
// Math.abs(BOUNDS.maxX - BOUNDS.minX) * Math.abs(BOUNDS.maxY - BOUNDS.minY)
// const result = blocks.size + (area - count)
// console.log(result)
