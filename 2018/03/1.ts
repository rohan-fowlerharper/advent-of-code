import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input
  .trimEnd()
  .split('\n')
  .map((l) => {
    const [id, , coords, size] = l.split(' ')
    const [x, y] = coords.slice(0, -1).split(',').map(Number)
    const [w, h] = size.split('x').map(Number)

    return { id, x, y, w, h }
  })

const max = lines.reduce(
  (acc, { x, y, w, h }) => {
    const maxX = Math.max(acc.x, x + w)
    const maxY = Math.max(acc.y, y + h)

    return { x: maxX, y: maxY }
  },
  { x: 0, y: 0 }
)

const fabric = Array.from({ length: max.y }, () =>
  Array.from({ length: max.x }, () => 0)
)

lines.forEach(({ x, y, w, h }) => {
  for (let i = y; i < y + h; i++) {
    for (let j = x; j < x + w; j++) {
      fabric[i][j]++
    }
  }
})

console.log(
  fabric.reduce((acc, row) => acc + row.filter((x) => x > 1).length, 0)
)
