import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

type OpenBracket = '(' | '[' | '{' | '<'
type CloseBracket = ')' | ']' | '}' | '>'

const scores = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
}
const flips: Record<OpenBracket, CloseBracket> = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
}
const reverseFlips: Record<CloseBracket, OpenBracket> = {
  ')': '(',
  ']': '[',
  '}': '{',
  '>': '<',
}

const lines = input.trimEnd().split('\n')

const totals: number[] = []
for (const line of lines) {
  const stack: OpenBracket[] = []
  let corrupted = false

  for (const bracket of line) {
    switch (bracket) {
      case '(':
      case '[':
      case '{':
      case '<':
        stack.push(bracket)
        break
      case ')':
      case ']':
      case '}':
      case '>':
        if (stack.pop() !== reverseFlips[bracket]) corrupted = true
    }
  }

  if (corrupted === true) continue

  const completions = stack.map((bracket) => flips[bracket]).reverse()
  const t = completions.reduce((t, bracket) => t * 5 + scores[bracket], 0)

  totals.push(t)
}

const half = Math.floor(totals.length / 2)
console.log(totals.sort((a, b) => a - b)[half])
