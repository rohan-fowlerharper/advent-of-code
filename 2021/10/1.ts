import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

type OpenBracket = '(' | '[' | '{' | '<'
type CloseBracket = ')' | ']' | '}' | '>'
const scores = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
}

const reverseFlips: Record<CloseBracket, OpenBracket> = {
  ')': '(',
  ']': '[',
  '}': '{',
  '>': '<',
}

const lines = input.trimEnd().split('\n')

const stack: string[] = []

let total = 0
for (const line of lines) {
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
        if (stack.pop() !== reverseFlips[bracket]) total += scores[bracket]
    }
  }
}

console.log(total)
