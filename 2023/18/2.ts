import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const colorToDirection = (v: number): Direction => {
  switch (v) {
    case 0:
      return 'R'
    case 1:
      return 'D'
    case 2:
      return 'L'
    case 3:
    default:
      return 'U'
  }
}

const lines = input
  .trimEnd()
  .split('\n')
  .map((l) => {
    const [, , color] = l.split(' ')

    // #(XXXXX X)
    const distance = parseInt(color.slice(2, 7), 16)
    const direction = colorToDirection(parseInt(color.slice(7, 8), 16))

    return {
      direction,
      distance,
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
let area = 0
let perimeter = 0

for (const l of lines) {
  const x1 = pos.x
  const y1 = pos.y
  const [dx, dy] = getDiff(l.direction)

  pos.x += dx * l.distance
  pos.y += dy * l.distance

  area += (x1 * pos.y - pos.x * y1) / 2
  perimeter += l.distance
}

// Pick's theorem
console.log(area + perimeter / 2 + 1)
