import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const bots = input
  .trimEnd()
  .split('\n')
  .map((line) => {
    const [x, y, dx, dy] = line.match(/-?\d+/g)!.map(Number)
    return { x, y, dx, dy }
  })

const STEPS = 10000

const width = Math.max(...bots.map(({ x }) => x + 1))
const height = Math.max(...bots.map(({ y }) => y + 1))

const printBots = (bots: { x: number; y: number }[]) => {
  const grid = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ' ')
  )

  for (const { x, y } of bots) {
    grid[y][x] = '█'
  }

  for (const [i, row] of grid.entries()) {
    console.log(`${i.toString().padStart(3, ' ')}${row.join('')}`)
  }
}

for (let step = 0; step < STEPS; step++) {
  const count = new Set(bots.map(({ x, y }) => `${x},${y}`)).size
  if (count === bots.length) {
    printBots(bots)
    console.log(step)
    break
  }

  for (const bot of bots) {
    bot.x = (bot.x + bot.dx + width) % width
    bot.y = (bot.y + bot.dy + height) % height
  }
}
