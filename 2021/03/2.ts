import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.split('\n')

const numBits = lines[0].length

const getBitFrequencies = (lines: string[]) => {
  const bitFrequencies = Array.from({ length: numBits }, () => 0)
  for (const line of lines) {
    const bits = line.split('')

    for (let i = 0; i < bits.length; i++) {
      const bit = bits[i]
      if (bit === '1') {
        bitFrequencies[i]++
      }
    }
  }

  return bitFrequencies
}

const getMostCommonBits = (lines: string[]) =>
  getBitFrequencies(lines).map((bit) => (bit >= lines.length / 2 ? '1' : '0'))

const getLeastCommonBits = (lines: string[]) =>
  getBitFrequencies(lines).map((bit) => (bit >= lines.length / 2 ? '0' : '1'))

const getCommonBitsRecursive = (
  lines: string[],
  getCommonBits: (lines: string[]) => string[]
) => {
  let commonLines = lines
  for (let i = 0; i < numBits; i++) {
    const commonBits = getCommonBits(commonLines)
    console.log('bits', commonBits)
    commonLines = commonLines.filter((l) => l.split('')[i] === commonBits[i])
    console.log(commonLines)
    if (commonLines.length === 1) {
      break
    }
  }
  return commonLines[0]
}

const oxygenBits = getCommonBitsRecursive(lines, getMostCommonBits)
const scrubberBits = getCommonBitsRecursive(lines, getLeastCommonBits)

console.log(parseInt(oxygenBits, 2) * parseInt(scrubberBits, 2))
