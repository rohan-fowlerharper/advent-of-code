import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const equations = input
  .trimEnd()
  .split('\n')
  .map((l) => {
    const [answer, eq] = l.split(': ')
    const numbers = eq.split(' ').map((n) => +n)
    return { answer: Number(answer), numbers }
  })

const VALID_OPERANDS = ['+', '*'] as const

const applyOperand = (a: number, b: number, operand: '+' | '*'): number => {
  switch (operand) {
    case '+':
      return a + b
    case '*':
      return a * b
  }
}

const validAnswers: number[] = []
for (const eq of equations) {
  const { answer, numbers } = eq
  const stack = [{ runningTotal: numbers[0], numbers: numbers.slice(1) }]

  while (stack.length) {
    const { runningTotal, numbers } = stack.pop()!
    if (numbers.length === 0) {
      if (runningTotal === answer) {
        validAnswers.push(eq.answer)
        break
      }
      continue
    }

    const [nextNumber, ...restNumbers] = numbers
    for (const operand of VALID_OPERANDS) {
      stack.push({
        runningTotal: applyOperand(runningTotal, nextNumber, operand),
        numbers: restNumbers,
      })
    }
  }
}

console.log(validAnswers.reduce((a, b) => a + b, 0))
