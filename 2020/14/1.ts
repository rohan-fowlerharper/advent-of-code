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
  if (l.startsWith('mask')) {
    return { mask: l.split(' = ')[1] }
  }
  const [_, address, value] = l.match(/mem\[(\d+)\] = (\d+)/)!
  return { address: Number(address), value: Number(value) }
})

const memory: Record<number, number> = {}

const applyMask = (value: number) => {
  const binary = value.toString(2).padStart(36, '0')
  const masked = binary
    .split('')
    .map((b, i) => (mask[i] === 'X' ? b : mask[i]))
    .join('')
  return parseInt(masked, 2)
}

let mask: string
instructions.forEach((instruction) => {
  if ('mask' in instruction) {
    mask = instruction.mask
    return
  } else {
    memory[instruction.address] = applyMask(instruction.value)
  }
})

const result = Object.values(memory).reduce((sum, value) => sum + value, 0)

performance.mark('end')

console.log(result)

console.log(
  `To parse: ${performance
    .measure('14.1', 'start', 'parsed')
    .duration.toFixed(3)}ms`
)

console.log(
  `To solve: ${performance
    .measure('14.1', 'parsed', 'end')
    .duration.toFixed(3)}ms`
)
