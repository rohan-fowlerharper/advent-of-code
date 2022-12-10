import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.split('\n')

const dirs = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
]

type Spot = [number, number]

const lowSpots: Spot[] = []
for (let i = 0; i < lines.length; i++) {
  for (let j = 0; j < lines[i].length; j++) {
    const spot = Number(lines[i][j])
    const isLow = dirs.every(([x, y]) => {
      if (lines[i + y]?.[j + x] === undefined) {
        return true
      }
      return Number(lines[i + y][j + x]) > spot
    })
    if (isLow) {
      lowSpots.push([j, i])
    }
  }
}

const basins: number[] = []
lowSpots.forEach(([x, y]) => {
  const spotsInBasin = new Map<string, Spot>()
  spotsInBasin.set(`${x},${y}`, [x, y])

  const findSpots = ([sX, sY]: Spot) => {
    const spotValue = Number(lines[sY][sX])

    dirs.forEach(([dx, dy]) => {
      if (spotsInBasin.has(`${sX + dx},${sY + dy}`)) return
      if (!lines[sY + dy]?.[sX + dx]) return

      const newSpotValue = Number(lines[sY + dy][sX + dx])

      if (newSpotValue !== 9 && newSpotValue > spotValue) {
        spotsInBasin.set(`${sX + dx},${sY + dy}`, [sX + dx, sY + dy])
        findSpots([sX + dx, sY + dy])
      }
    })
  }

  findSpots([x, y])
  basins.push(spotsInBasin.size)
})

console.log(
  basins
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((t, n) => t * n, 1)
)
