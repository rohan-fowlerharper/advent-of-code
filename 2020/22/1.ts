import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const players = input
  .trimEnd()
  .split('\n\n')
  .map((p) => {
    return p
      .split('\n')
      .slice(1)
      .map((n) => parseInt(n))
  })

const play = (p1: number[], p2: number[]): number[] => {
  while (p1.length > 0 && p2.length > 0) {
    const c1 = p1.shift()!
    const c2 = p2.shift()!

    if (c1 > c2) {
      p1.push(c1, c2)
    } else {
      p2.push(c2, c1)
    }
  }

  return p1.length > 0 ? p1 : p2
}

const winner = play(players[0], players[1])

const score = winner.reduce((acc, c, i) => {
  return acc + c * (winner.length - i)
}, 0)

console.log(score)
