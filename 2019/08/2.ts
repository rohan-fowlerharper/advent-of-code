import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const stream = input.trimEnd().replace('\n', '').split('').map(Number)

const width = 25
const height = 6

const layers = stream.reduce((acc, pixel, index) => {
  const layerIndex = Math.floor(index / (width * height))
  const layer = acc[layerIndex] || []
  layer.push(pixel)
  acc[layerIndex] = layer
  return acc
}, [] as number[][])

const image = layers.reduce((image, layer) => {
  layer.forEach((pixel, index) => {
    if (image[index] === undefined && pixel !== 2) {
      image[index] = pixel
    }
  })
  return image
}, [] as number[])

const rows = image.reduce((rows, pixel, index) => {
  const row = Math.floor(index / width)
  rows[row] = rows[row] || []
  rows[row].push(pixel)
  return rows
}, [] as number[][])

rows.forEach((row) => {
  console.log(row.map((pixel) => (pixel === 0 ? ' ' : '█')).join(''))
})
