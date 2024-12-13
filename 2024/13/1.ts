import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const games = input
  .trimEnd()
  .split('\n\n')
  .map((game) => {
    const [aRaw, bRaw, prizeRaw] = game.split('\n')

    // Button A: X+17, Y+86
    const [aX, aY] = aRaw
      .match(/Button A: X\+(\d+), Y\+(\d+)/)!
      .slice(1)
      .map(Number)

    const [bX, bY] = bRaw
      .match(/Button B: X\+(\d+), Y\+(\d+)/)!
      .slice(1)
      .map(Number)

    // Prize: X=7870, Y=6450
    const [prizeX, prizeY] = prizeRaw
      .match(/Prize: X=(\d+), Y=(\d+)/)!
      .slice(1)
      .map(Number)

    return {
      a: { x: aX, y: aY },
      b: { x: bX, y: bY },
      prize: { x: prizeX, y: prizeY },
    }
  })

const COST_A = 3
const COST_B = 1
const PRESSES_PER_BUTTON = 100

const scores = []
for (const { a, b, prize } of games) {
  outer: for (let A = 0; A < PRESSES_PER_BUTTON; A++) {
    for (let B = 0; B < PRESSES_PER_BUTTON; B++) {
      const x = a.x * A + b.x * B
      const y = a.y * A + b.y * B

      if (x === prize.x && y === prize.y) {
        const cost = A * COST_A + B * COST_B
        scores.push(cost)
        break outer
      }
    }
  }
}

console.log(scores.reduce((a, b) => a + b, 0))
