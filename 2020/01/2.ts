import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.trimEnd().split('\n').map(Number)

for (let i = 0; i < lines.length; i++) {
  for (let j = i + 1; j < lines.length; j++) {
    for (let k = j + 1; k < lines.length; k++) {
      if (lines[i] + lines[j] + lines[k] === 2020) {
        console.log(lines[i] * lines[j] * lines[k])
      }
    }
  }
}
