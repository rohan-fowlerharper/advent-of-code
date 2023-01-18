import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'
import createComputer from './computer.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const stream = input.trimEnd().replace('\n', '').split(',').map(Number)

const run = createComputer([...stream])

const outputs: number[] = []
while (true) {
  const { output, done } = run()
  if (done) break
  outputs.push(output)
}

// count every third output that is a 2
const count = outputs.reduce((acc, curr, i) => {
  if (i % 3 === 2 && curr === 2) return acc + 1
  return acc
}, 0)

console.log(count)
