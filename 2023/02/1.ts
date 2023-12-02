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

const requireds = {
  red: 12,
  green: 13,
  blue: 14,
}
const colors = ['red', 'green', 'blue'] as const

const validGames = games.filter((game) =>
  game.sets.every((set) =>
    colors.every((color) => set[color] <= requireds[color])
  )
)
console.log(validGames.map((g) => g.n).reduce((a, b) => a + b, 0))
