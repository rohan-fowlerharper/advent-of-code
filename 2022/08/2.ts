import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.split('\n')
const trees: [string, number][][] = lines.map((l) =>
  l.split('').map((t) => [t, 1])
)

const width = trees[0].length
const height = trees.length

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
      trees[y][x][1] = 0
      continue
    }

    let count = 0
    for (let y2 = y - 1; y2 >= 0; y2--) {
      count++
      if (trees[y2][x][0] >= trees[y][x][0]) {
        break
      }
    }
    trees[y][x][1] *= count

    count = 0
    for (let y2 = y + 1; y2 < height; y2++) {
      count++
      if (trees[y2][x][0] >= trees[y][x][0]) {
        break
      }
    }
    trees[y][x][1] *= count

    count = 0
    for (let x2 = x - 1; x2 >= 0; x2--) {
      count++
      if (trees[y][x2][0] >= trees[y][x][0]) {
        break
      }
    }
    trees[y][x][1] *= count

    count = 0
    for (let x2 = x + 1; x2 < width; x2++) {
      count++
      if (trees[y][x2][0] >= trees[y][x][0]) {
        break
      }
    }
    trees[y][x][1] *= count
  }
}

let max = 0
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const val = trees[y][x][1]
    if (val > max) {
      max = val
    }
  }
}

console.log(max)
