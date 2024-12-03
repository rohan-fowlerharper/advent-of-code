import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const line = input.trimEnd()
console.log(line)

const regex = /mul\((\d{1,3}),(\d{1,3})\)/

let total = 0
let match: RegExpExecArray | null

while ((match = regex.exec(line)) !== null) {
  const [_, a, b] = match
  total += parseInt(a) * parseInt(b)
}

console.log(total)
