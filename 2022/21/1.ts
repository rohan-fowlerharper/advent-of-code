import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

type Operator = '+' | '*' | '-' | '/'
type Key = string
const monkeys = new Map<Key, number | { a: Key; b: Key; operator: Operator }>()

input
  .trimEnd()
  .split('\n')
  .forEach((l) => {
    const [id, operation] = l.split(': ')

    if (Number(operation)) {
      monkeys.set(id, Number(operation))
    } else {
      const [a, operator, b] = operation.split(' ') as [Key, Operator, Key]

      monkeys.set(id, {
        a,
        b,
        operator: operator,
      })
    }
  })

const retrieveResult = (key: string): number => {
  const value = monkeys.get(key)!

  if (typeof value === 'number') return value

  const a = retrieveResult(value.a)!
  const b = retrieveResult(value.b)!

  switch (value.operator) {
    case '+':
      return a + b
    case '-':
      return a - b
    case '*':
      return a * b
    case '/':
      return a / b
  }
}

const res = retrieveResult('root')

console.log(res)
