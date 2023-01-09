import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

performance.mark('start')

const instructions = input
  .trimEnd()
  .split('\n')
  .map((l) => {
    const [_, letter, n] = l.match(/([A-Z])(\d+)/)!

    return [letter, Number(n)] as readonly [Dir | Turn | Forward, number]
  })

performance.mark('parsed')

const location = { x: 0, y: 0 }
type Dir = 'N' | 'E' | 'S' | 'W'
type Turn = 'L' | 'R'
type Forward = 'F'

const dirArray = ['N', 'E', 'S', 'W'] as const
const dirs = {
  N: [0, 1],
  E: [1, 0],
  S: [0, -1],
  W: [-1, 0],
}
let facing: Dir = 'E'

const turn = (dir: 'L' | 'R', deg: number) => {
  const turns = deg / 90
  const n = dir === 'L' ? -1 : 1

  facing = dirArray[(dirArray.indexOf(facing) + n * turns + 4) % 4]
}

const move = (dir: 'N' | 'E' | 'S' | 'W', dist: number) => {
  const [dx, dy] = dirs[dir]

  location.x += dx * dist
  location.y += dy * dist
}

const forward = (dist: number) => {
  const [dx, dy] = dirs[facing]

  location.x += dx * dist
  location.y += dy * dist
}

for (const instruction of instructions) {
  const [letter, n] = instruction

  if (letter === 'L' || letter === 'R') turn(letter, n)
  else if (letter === 'F') forward(n)
  else move(letter, n)
}

const manhattan = Math.abs(location.x) + Math.abs(location.y)

performance.mark('end')

console.log(
  `To parse: ${performance
    .measure('12.1', 'start', 'parsed')
    .duration.toFixed(3)}ms`
)

console.log(
  `To solve: ${performance
    .measure('12.1', 'parsed', 'end')
    .duration.toFixed(3)}ms`
)

console.log(manhattan)
