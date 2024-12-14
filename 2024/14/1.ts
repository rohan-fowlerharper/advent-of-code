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

const STEPS = 100

const width = Math.max(...bots.map(({ x }) => x + 1))
const height = Math.max(...bots.map(({ y }) => y + 1))

for (let step = 0; step < STEPS; step++) {
  for (const bot of bots) {
    bot.x = (bot.x + bot.dx + width) % width
    bot.y = (bot.y + bot.dy + height) % height
  }
}

const tl = bots.filter(
  ({ x, y }) => x < width / 2 - 1 && y < height / 2 - 1
).length
const tr = bots.filter(({ x, y }) => x > width / 2 && y < height / 2 - 1).length
const bl = bots.filter(({ x, y }) => x < width / 2 - 1 && y > height / 2).length
const br = bots.filter(({ x, y }) => x > width / 2 && y > height / 2).length

console.log(tl * tr * bl * br)
