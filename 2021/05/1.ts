import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.split('\n')

const inputs = lines.map((line) => {
  const [x1, y1, x2, y2] = line.replace(' -> ', ',').split(',').map(Number)
  return { x1, y1, x2, y2 }
})

const maxX = Math.max(...inputs.map((i) => [i.x2, i.x1]).flat())
const maxY = Math.max(...inputs.map((i) => [i.y2, i.y1]).flat())
console.log(maxX, maxY)

const matrix = Array.from({ length: maxY + 1 }, () =>
  Array.from({ length: maxX + 1 }, () => 0)
)
for (const { x1, y1, x2, y2 } of inputs) {
  console.log({ x1, y1, x2, y2 })
  if (x1 === x2 || y1 === y2) {
    const [startY, endY] = [y1, y2].sort((a, b) => a - b)
    const [startX, endX] = [x1, x2].sort((a, b) => a - b)
    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        matrix[y][x]++
      }
    }
    // console.log(
    //   matrix.map((row) => row.join('').replaceAll('0', '.')).join('\n')
    // )
  }
}

const result = matrix.flat().filter((i) => i > 1).length

console.log(result)
