import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

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
        switch (d) {
          case 'E':
            return [1, 0]
          case 'W':
            return [-1, 0]
          case 'SE':
            return [0, 1]
          case 'SW':
            return [-1, 1]
          case 'NE':
            return [1, -1]
          case 'NW':
            return [0, -1]
          default:
            throw new Error('Invalid direction')
        }
      })
    return a.reduce(
      (acc, [x, y]) => {
        return [acc[0] + x, acc[1] + y]
      },
      [0, 0] as [number, number]
    )
  })

console.log(locations)

const tiles = new Map<string, boolean>()
for (const [x, y] of locations) {
  const key = `${x},${y}`
  if (tiles.has(key)) {
    tiles.set(key, !tiles.get(key)!)
  } else {
    tiles.set(key, true)
  }
}

console.log(tiles)

const count = [...tiles.values()].filter((b) => b).length

console.log(count)
