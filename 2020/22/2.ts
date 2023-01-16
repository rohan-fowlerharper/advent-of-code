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

const play = (p1: number[], p2: number[]): [number[], number[]] => {
  const seen = new Set<string>()

  while (p1.length > 0 && p2.length > 0) {
    const key = p1.join(',') + ':' + p2.join(',')

    if (seen.has(key)) return [p1, []]
    seen.add(key)

    const c1 = p1.shift()!
    const c2 = p2.shift()!

    let p1Wins = c1 > c2
    if (p1.length >= c1 && p2.length >= c2) {
      p1Wins = play(p1.slice(0, c1), p2.slice(0, c2))[0].length > 0
    }

    if (p1Wins) {
      p1.push(c1, c2)
    } else {
      p2.push(c2, c1)
    }
  }

  return [p1, p2]
}

const result = play(players[0], players[1])

const winner = result[0].length > 0 ? result[0] : result[1]

console.log(winner)

const score = winner.reduce((acc, c, i) => {
  return acc + c * (winner.length - i)
}, 0)

console.log(score)
