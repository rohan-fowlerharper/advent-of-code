import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.split('\n')
const trees = lines.map((l) => l.split('').map((t) => [t, false]))

const width = trees[0].length
const height = trees.length

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const tree = trees[y][x]
    if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
      trees[y][x][1] = true
      continue
    }

    let visible = true
    for (let y2 = y - 1; y2 >= 0; y2--) {
      if (trees[y2][x][0] >= trees[y][x][0]) {
        visible = false
        break
      }
    }
    trees[y][x][1] = visible
    if (tree[1]) continue

    visible = true
    for (let y2 = y + 1; y2 < height; y2++) {
      if (trees[y2][x][0] >= trees[y][x][0]) {
        visible = false
        break
      }
    }
    trees[y][x][1] = visible
    if (tree[1]) continue

    visible = true
    for (let x2 = x - 1; x2 >= 0; x2--) {
      if (trees[y][x2][0] >= trees[y][x][0]) {
        visible = false
        break
      }
    }
    trees[y][x][1] = visible
    if (tree[1]) continue

    visible = true
    for (let x2 = x + 1; x2 < width; x2++) {
      if (trees[y][x2][0] >= trees[y][x][0]) {
        visible = false
        break
      }
    }
    trees[y][x][1] = visible
  }
}

let count = 0
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (trees[y][x][1]) {
      count++
    }
  }
}

console.log(count)
