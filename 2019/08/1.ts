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

const { layer } = layers.reduce(
  (min, layer) => {
    const zeros = layer.filter((pixel) => pixel === 0).length
    if (zeros < min.zeros) {
      min.zeros = zeros
      min.layer = layer
    }
    return min
  },
  { zeros: Infinity, layer: [] as number[] }
)

const ones = layer.filter((pixel) => pixel === 1).length
const twos = layer.filter((pixel) => pixel === 2).length

console.log(ones * twos)
