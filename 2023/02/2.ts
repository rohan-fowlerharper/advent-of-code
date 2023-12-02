import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

type Color = 'red' | 'green' | 'blue'
const lines = input.trimEnd().split('\n')
const games = lines.map((l, index) => {
  const [, games] = l.split(': ')
  const sets = games.split('; ').map((set) => {
    return set.split(', ').reduce(
      (acc, cube) => {
        const [count, color] = cube.split(' ')
        acc[color as Color] = parseInt(count)
        return acc
      },
      {
        red: 0,
        green: 0,
        blue: 0,
      }
    )
  })

  return {
    n: index + 1,
    sets,
  }
})

const maxValues = games
  .map((game) => ({
    red: Math.max(...game.sets.map((s) => s.red)),
    green: Math.max(...game.sets.map((s) => s.green)),
    blue: Math.max(...game.sets.map((s) => s.blue)),
  }))
  .map((m) => m.red * m.green * m.blue)

console.log(maxValues.reduce((a, b) => a + b, 0))
