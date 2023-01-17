import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'
import createComputer from './computer.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const stream = input.trimEnd().replace('\n', '').split(',').map(Number)
const run = createComputer(1, stream)
const { output } = run()

console.log(output)
