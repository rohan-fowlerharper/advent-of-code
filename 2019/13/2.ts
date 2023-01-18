import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'
import createComputer from './computer.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const stream = input.trimEnd().replace('\n', '').split(',').map(Number)

stream[0] = 2

const run = createComputer([...stream], () => {
  const paddle = [...tiles.entries()].find(([_, v]) => v === 3)![0]

  const ball = [...tiles.entries()].find(([_, v]) => v === 4)![0]

  const [px] = paddle.split(',').map(Number)
  const [bx] = ball.split(',').map(Number)

  if (px < bx) return 1
  if (px > bx) return -1
  return 0
})

const tiles = new Map<string, number>()
const key = (x: number, y: number) => `${x},${y}`

let score = 0
while (true) {
  const { output: x } = run()
  const { output: y } = run()
  const { output: tileId, done } = run()

  if (done) {
    console.log(score)
    break
  }

  if (x === -1 && y === 0) {
    score = tileId
    continue
  } else {
    tiles.set(key(x, y), tileId)
  }
}
