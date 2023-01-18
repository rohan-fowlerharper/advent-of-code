import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'
import createComputer from './computer.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const stream = input.trimEnd().replace('\n', '').split(',').map(Number)

type Coord = `${number},${number}`
type Point = { x: number; y: number }
const grid = new Set<Coord>()
const painted = new Set<Coord>()

const key = (p: Point): Coord => `${p.x},${p.y}`

const memory = [...stream]
const run = createComputer(memory)
const dirs = [
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: 0 },
] as const
let facing = 0
const turn = (direction: number) => {
  if (direction === 0) facing = (facing + 1) % 4
  else if (direction === 1) facing = (facing + 3) % 4
}

let pos: Point = { x: 0, y: 0 }
let done = false

while (!done) {
  const input = grid.has(key(pos)) ? 1 : 0
  const first = run(input)

  console.log('first', first)
  if (first.output === 1) {
    grid.add(key(pos))
  } else {
    grid.delete(key(pos))
  }
  painted.add(key(pos))

  const second = run(input)
  console.log(second)
  turn(second.output)

  pos = {
    x: pos.x + dirs[facing].x,
    y: pos.y + dirs[facing].y,
  }

  done = first.done || second.done
}
