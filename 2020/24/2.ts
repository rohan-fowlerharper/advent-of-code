import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const dirs = {
  E: [1, 0],
  W: [-1, 0],
  SE: [0, 1],
  SW: [-1, 1],
  NE: [1, -1],
  NW: [0, -1],
}

const locations = input
  .trimEnd()
  .split('\n')
  .map((l) => {
    const a = l
      .replaceAll('se', 'SE ')
      .replaceAll('sw', 'SW ')
      .replaceAll('ne', 'NE ')
      .replaceAll('nw', 'NW ')
      .replaceAll('e', 'E ')
      .replaceAll('w', 'W ')
      .trimEnd()
      .split(' ')
      .map((d) => {
        return dirs[d as keyof typeof dirs]
      })
    return a.reduce(
      (acc, [x, y]) => {
        return [acc[0] + x, acc[1] + y]
      },
      [0, 0]
    )
  })

const maxX = Math.max(...locations.map(([x]) => x))
const maxY = Math.max(...locations.map(([, y]) => y))
const minX = Math.min(...locations.map(([x]) => x))
const minY = Math.min(...locations.map(([, y]) => y))

let tiles: boolean[][] = Array.from({ length: maxY - minY + 1 }, () =>
  Array.from({ length: maxX - minX + 1 }, () => false)
)

for (const [x, y] of locations) {
  tiles[y - minY][x - minX] = !tiles[y - minY][x - minX]
}

for (let i = 0; i < 100; i++) {
  tiles = tiles.map((row) => [false, ...row, false])
  tiles.unshift(Array.from({ length: tiles[0].length }, () => false))
  tiles.push(Array.from({ length: tiles[0].length }, () => false))

  const newTiles = tiles.map((row) => [...row])

  for (let y = 0; y < tiles.length; y++) {
    for (let x = 0; x < tiles[0].length; x++) {
      const aliveNeighbours = Object.values(dirs)
        .map(([dx, dy]) => [x + dx, y + dy])
        .filter(
          ([x, y]) =>
            x >= 0 && y >= 0 && x < tiles[0].length && y < tiles.length
        )
        .filter(([x, y]) => tiles[y][x]).length

      if (tiles[y][x]) {
        if (aliveNeighbours === 0 || aliveNeighbours > 2) {
          newTiles[y][x] = false
        }
      } else {
        if (aliveNeighbours === 2) {
          newTiles[y][x] = true
        }
      }
    }
  }
  tiles = newTiles
}

console.log(
  tiles.map((row) => row.filter((b) => b).length).reduce((a, b) => a + b)
)
