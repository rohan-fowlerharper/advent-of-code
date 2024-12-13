import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const games = input
  .trimEnd()
  .split('\n\n')
  .map((game) => {
    const [aRaw, bRaw, prizeRaw] = game.split('\n')

    const [aX, aY] = aRaw
      .match(/Button A: X\+(\d+), Y\+(\d+)/)!
      .slice(1)
      .map(Number)

    const [bX, bY] = bRaw
      .match(/Button B: X\+(\d+), Y\+(\d+)/)!
      .slice(1)
      .map(Number)

    const [prizeX, prizeY] = prizeRaw
      .match(/Prize: X=(\d+), Y=(\d+)/)!
      .slice(1)
      .map(Number)

    return {
      a: { x: aX, y: aY },
      b: { x: bX, y: bY },
      prize: { x: prizeX + 10000000000000, y: prizeY + 10000000000000 },
    }
  })

const COST_A = 3
const COST_B = 1

const isWholeNumber = (num: number) => Number.isInteger(num) && num >= 0

const scores = []
for (const { a, b, prize } of games) {
  const determinant = a.x * b.y - b.x * a.y

  if (determinant === 0) continue

  const A = (prize.x * b.y - b.x * prize.y) / determinant
  const B = (a.x * prize.y - prize.x * a.y) / determinant

  if (isWholeNumber(A) && isWholeNumber(B) && A >= 0 && B >= 0) {
    const cost = A * COST_A + B * COST_B
    scores.push(cost)
  }
}

console.log(scores.reduce((a, b) => a + b, 0))
