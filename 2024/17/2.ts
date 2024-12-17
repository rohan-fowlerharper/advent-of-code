import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const [_, programRaw] = input.trimEnd().split('\n\n')

const digits = programRaw.match(/\d+/g)!.map(BigInt)

type Combo = 'A' | 'B' | 'C' | bigint
type Instruction = { opcode: bigint; literal: bigint; combo: Combo }
const instructions: Instruction[] = []

for (let i = 0; i < digits.length; i += 2) {
  const opcode = digits[i]
  const literal = digits[i + 1]
  let combo: Combo = literal
  switch (literal) {
    case 4n:
      combo = 'A'
      break
    case 5n:
      combo = 'B'
      break
    case 6n:
      combo = 'C'
      break
  }

  instructions.push({
    opcode,
    literal,
    combo,
  })
}

type Registers = { A: bigint; B: bigint; C: bigint }

const resolveCombo = (combo: Combo, registers: Registers) =>
  typeof combo === 'bigint' ? combo : registers[combo]

function processInstruction(
  registers: Registers,
  instruction: Instruction,
  output: bigint[],
  instructionPointer: number
): number {
  const { combo, literal, opcode } = instruction

  instructionPointer += 1

  switch (opcode) {
    case 0n: // adv
      registers.A = registers.A >> resolveCombo(combo, registers)
      break
    case 1n: // bxl
      registers.B ^= literal
      break
    case 2n: // bst
      registers.B = resolveCombo(combo, registers) % 8n
      break
    case 3n: // jnz
      if (registers.A !== 0n) {
        instructionPointer = Number(literal)
      }
      break
    case 4n: // bxc
      registers.B ^= registers.C
      break
    case 5n: // out
      output.push(resolveCombo(combo, registers) % 8n)
      break
    case 6n: // bdv
      registers.B = registers.A >> resolveCombo(combo, registers)
      break
    case 7n: // cdv
      registers.C = registers.A >> resolveCombo(combo, registers)
      break
    default:
      throw new Error(`Unknown opcode: ${opcode}`)
  }

  return instructionPointer
}

function run(a: bigint) {
  const registers = { A: a, B: 0n, C: 0n }
  const output: bigint[] = []
  let pointer = 0

  while (pointer < instructions.length) {
    const instruction = instructions[pointer]
    const newPointer = processInstruction(
      registers,
      instruction,
      output,
      pointer
    )

    pointer = newPointer
  }

  return output
}

type StackItem = {
  length: number
  A: bigint
}

let min: bigint | null = null

const stack: StackItem[] = [
  {
    length: 0,
    A: 0n,
  },
]

while (stack.length > 0) {
  const current = stack.pop()!

  if (current.length === digits.length) {
    if (min === null || current.A < min) {
      min = current.A
    }
    continue
  }

  for (let i = 0n; i <= 7n; i++) {
    const next = {
      length: current.length + 1,
      A: i + 2n ** 3n * current.A,
    }
    const nextOutput = run(next.A)

    // console.log(nextOutput, digits.slice(digits.length - next.length))

    if (nextOutput[0] === digits[digits.length - next.length]) {
      stack.push(next)
    }
  }
}

console.log(min)
