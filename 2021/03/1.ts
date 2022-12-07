import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.split('\n')

const totalLines = lines.length
const numBits = Array.from({ length: lines[0].length }, () => 0)
for (const line of lines) {
  const bits = line.split('')

  for (let i = 0; i < bits.length; i++) {
    const bit = bits[i]
    if (bit === '1') {
      numBits[i]++
    }
  }
}

let gammaRate = ''
let epsilon = ''
for (const bit of numBits) {
  if (bit > totalLines / 2) {
    gammaRate += '1'
    epsilon += '0'
  } else {
    gammaRate += '0'
    epsilon += '1'
  }
}

console.log(parseInt(gammaRate, 2) * parseInt(epsilon, 2))
