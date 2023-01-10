import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

performance.mark('start')

const lines = input.trimEnd().split('\n')

performance.mark('parsed')

const evaluateSubExpression = (expression: string) => {
  const symbols = expression.split(' ')

  let result = 0
  let operator = '+'

  for (const symbol of symbols) {
    if (symbol === '+' || symbol === '*') {
      operator = symbol
      continue
    }

    if (operator === '+') {
      result += Number(symbol)
    } else {
      result *= Number(symbol)
    }
  }

  return result
}

function evaluateExpression(expression: string) {
  const stack: string[] = []

  for (const char of expression) {
    if (char === ')') {
      let subExpression = ''

      while (stack[stack.length - 1] !== '(') {
        subExpression = stack.pop() + subExpression
      }

      stack.pop()

      stack.push(evaluateSubExpression(subExpression).toString())
    } else {
      stack.push(char)
    }
  }

  return evaluateSubExpression(stack.join(''))
}

const result = lines.reduce((a, b) => a + evaluateExpression(b), 0)

performance.mark('end')

console.log(result)

console.log(
  `To parse: ${performance
    .measure('16.2', 'start', 'parsed')
    .duration.toFixed(3)}ms`
)

console.log(
  `To solve: ${performance
    .measure('16.2', 'parsed', 'end')
    .duration.toFixed(3)}ms`
)
