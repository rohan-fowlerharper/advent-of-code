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
const waypoint = { dx: 10, dy: 1 }

type Dir = 'N' | 'E' | 'S' | 'W'
type Turn = 'L' | 'R'
type Forward = 'F'

const dirs = {
  N: [0, 1],
  E: [1, 0],
  S: [0, -1],
  W: [-1, 0],
}

const turn = (dir: 'L' | 'R', deg: number) => {
  const turns = deg / 90

  for (let i = 0; i < turns; i++) {
    if (dir === 'L') {
      const temp = waypoint.dx
      waypoint.dx = -waypoint.dy
      waypoint.dy = temp
    } else {
      const temp = waypoint.dy
      waypoint.dy = -waypoint.dx
      waypoint.dx = temp
    }
  }
}

const move = (dir: 'N' | 'E' | 'S' | 'W', dist: number) => {
  const [dx, dy] = dirs[dir]

  waypoint.dx += dx * dist
  waypoint.dy += dy * dist
}

const forward = (dist: number) => {
  const { dx, dy } = waypoint

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

console.log(manhattan)

console.log(
  `To parse: ${performance
    .measure('12.2', 'start', 'parsed')
    .duration.toFixed(3)}ms`
)

console.log(
  `To solve: ${performance
    .measure('12.2', 'parsed', 'end')
    .duration.toFixed(3)}ms`
)
