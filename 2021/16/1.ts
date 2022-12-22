import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const bits = parseInt(input.trimEnd(), 16)
  .toString(2)
  .padStart(input.length * 4, '0')

console.log('00111000000000000110111101000101001010010001001000000000')
console.log(bits)

const bit2dec = (bits: string) => parseInt(bits, 2)

let totalV = 0
const processBits = (bits: string) => {
  const v = bit2dec(bits.slice(0, 3))
  totalV += v
  const t = bit2dec(bits.slice(3, 6))

  if (t === 4) {
    return processType4(bits.slice(6))
  } else {
    const tId = bits[6]
    if (tId === '0') {
      const n = bit2dec(bits.slice(7, 7 + 15))
      const rest = bits.slice(7 + 15)

      let totalLength = 0
      let totalValue = 0
      while (totalLength !== n) {
        const { value, length } = processBits(rest.slice(totalLength))!
        totalLength += length
        totalValue += value
      }
    } else if (tId === '1') {
      const n = bit2dec(bits.slice(7, 7 + 11))
      console.log(n)
    }
  }
}

const processType4 = (bits: string) => {
  // console.log('bits:', bits, bits.length)
  let literal = ''

  for (let i = 0; true; i += 5) {
    const h = bits[i]
    const b = bits.slice(i + 1, i + 5)

    literal += b

    if (h === '0') {
      break
    }
  }

  const length = 6 + (literal.length / 4) * 5
  // const length = lastBit + 4 - (lastBit % 4 || 4)

  return {
    value: bit2dec(literal),
    literal,
    length,
  }
}

console.log(bits)
const result = processBits(bits)

if (result === undefined) console.log('nomatch')
else console.log(result)
console.log(totalV)
