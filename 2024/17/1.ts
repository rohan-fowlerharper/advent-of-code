import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const [registersRaw, programRaw] = input.trimEnd().split('\n\n')

const [A, B, C] = registersRaw.match(/\d+/g)!.map(Number)

const digits = programRaw.match(/\d+/g)!.map(Number)

type Combo = 'A' | 'B' | 'C' | number
type Instruction = { opcode: number; literal: number; combo: Combo }
const instructions: Instruction[] = []

for (let i = 0; i < digits.length; i += 2) {
  const opcode = digits[i]
  const literal = digits[i + 1]
  let combo: Combo = literal
  switch (literal) {
    case 4:
      combo = 'A'
      break
    case 5:
      combo = 'B'
      break
    case 6:
      combo = 'C'
      break
  }

  instructions.push({
    opcode,
    literal,
    combo,
  })
}

type Registers = { A: number; B: number; C: number }

const resolveCombo = (combo: Combo, registers: Registers) =>
  typeof combo === 'number' ? combo : registers[combo]

function processInstruction(
  registers: Registers,
  instruction: Instruction,
  output: number[],
  instructionPointer: number
): number {
  const { combo, literal, opcode } = instruction

  instructionPointer += 1

  switch (opcode) {
    case 0: // adv
      registers.A = Math.floor(
        registers.A / Math.pow(2, resolveCombo(combo, registers))
      )
      break
    case 1: // bxl
      registers.B ^= literal
      break
    case 2: // bst
      registers.B = resolveCombo(combo, registers) % 8
      break
    case 3: // jnz
      if (registers.A !== 0) {
        instructionPointer = literal
      }
      break
    case 4: // bxc
      registers.B ^= registers.C
      break
    case 5: // out
      output.push(resolveCombo(combo, registers) % 8)
      break
    case 6: // bdv
      registers.B = Math.floor(
        registers.A / Math.pow(2, resolveCombo(combo, registers))
      )
      break
    case 7: // cdv
      registers.C = Math.floor(
        registers.A / Math.pow(2, resolveCombo(combo, registers))
      )
      break
    default:
      throw new Error(`Unknown opcode: ${opcode}`)
  }

  return instructionPointer
}

const registers = { A, B, C }
const output: number[] = []
let pointer = 0

while (pointer < instructions.length) {
  const instruction = instructions[pointer]
  const newPointer = processInstruction(registers, instruction, output, pointer)

  pointer = newPointer
}
console.log(output.join(','))
