import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

performance.mark('start')

const lines = input.trimEnd().split('\n')

performance.mark('parsed')

const evaluate = (expression: string) => {
  const symbols = expression.split(' ')

  while (symbols.includes('+')) {
    for (const [i, symbol] of symbols.entries()) {
      if (symbols[i + 1] === '+') {
        symbols.splice(
          i,
          3,
          (Number(symbol) + Number(symbols[i + 2])).toString()
        )
      }
    }
  }

  return symbols.filter((c) => c !== '*').reduce((p, c) => p * Number(c), 1)
}

function main(expression: string) {
  const stack: string[] = []

  for (const char of expression) {
    if (char === ')') {
      let subExpression = ''

      while (stack[stack.length - 1] !== '(') {
        subExpression = stack.pop() + subExpression
      }

      stack.pop()

      stack.push(evaluate(subExpression).toString())
    } else {
      stack.push(char)
    }
  }

  return evaluate(stack.join(''))
}

const result = lines.reduce((a, b) => a + main(b), 0)

performance.mark('end')

console.log(result)

console.log(
  `To parse: ${performance
    .measure('18.2', 'start', 'parsed')
    .duration.toFixed(3)}ms`
)

console.log(
  `To solve: ${performance
    .measure('18.2', 'parsed', 'end')
    .duration.toFixed(3)}ms`
)
