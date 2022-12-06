import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.split('\n')

let count = 0
for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '') continue
  if (parseInt(lines[i]) > parseInt(lines[i - 1])) {
    count++
  }
}

console.log(count)
