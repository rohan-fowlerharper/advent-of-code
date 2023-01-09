import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

performance.mark('start')

const lines = input.trimEnd().split('\n')

performance.mark('parsed')

type Instruction = { address: number; value: number }
type Mask = { mask: string }
const instructions: (Instruction | Mask)[] = lines.map((l) => {
  if (l.startsWith('mask')) return { mask: l.split(' = ')[1] }

  const [_, address, value] = l.match(/mem\[(\d+)\] = (\d+)/)!
  return { address: Number(address), value: Number(value) }
})

const memory: Record<string, number> = {}

const toNBitBinary = (value: number, n = 36) =>
  value.toString(2).padStart(n, '0')

const applyMask = (value: number, mask: string) => {
  const binary = toNBitBinary(value)

  const masked = binary
    .split('')
    .map((b, i) => {
      if (mask[i] === 'X') return 'X'
      if (mask[i] === '1') return '1'
      return b
    })
    .join('')
  return masked
}

const getCombinationsOfFloatingBits = (value: string) => {
  const combinations = []
  const floatingBits = value.split('').filter((b) => b === 'X')
  const numberOfCombinations = 2 ** floatingBits.length

  const floatingIndices = value
    .split('')
    .map((bit, i) => (bit === 'X' ? i : null))
    .filter(<T>(bit: T): bit is NonNullable<T> => bit !== null)

  for (let i = 0; i <= numberOfCombinations; i++) {
    const binary = toNBitBinary(i, floatingBits.length)

    const combination = value.split('')
    binary.split('').forEach((b, i) => {
      combination[floatingIndices[i]] = b
    })
    combinations.push(combination.join(''))
  }

  return combinations
}

let mask: string
instructions.forEach((instruction) => {
  if ('mask' in instruction) {
    mask = instruction.mask
  } else {
    const addresses = getCombinationsOfFloatingBits(
      applyMask(instruction.address, mask)
    )

    addresses.forEach((address) => {
      memory[address] = instruction.value
    })
  }
})

const result = Object.values(memory).reduce((sum, value) => sum + value, 0)

performance.mark('end')

console.log(result)

console.log(
  `To parse: ${performance
    .measure('14.2', 'start', 'parsed')
    .duration.toFixed(3)}ms`
)

console.log(
  `To solve: ${performance
    .measure('14.2', 'parsed', 'end')
    .duration.toFixed(3)}ms`
)
