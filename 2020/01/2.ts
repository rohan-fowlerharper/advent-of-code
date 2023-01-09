import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

performance.mark('start')

const lines = input.trimEnd().split('\n').map(Number)

performance.mark('parsed')

for (let i = 0; i < lines.length; i++) {
  for (let j = i + 1; j < lines.length; j++) {
    for (let k = j + 1; k < lines.length; k++) {
      if (lines[i] + lines[j] + lines[k] === 2020) {
        performance.mark('end')
        console.log(lines[i] * lines[j] * lines[k])
      }
    }
  }
}

console.log(
  `To parse: ${performance
    .measure('01.2', 'start', 'parsed')
    .duration.toFixed(3)}ms`
)

console.log(
  `To solve: ${performance
    .measure('01.2', 'parsed', 'end')
    .duration.toFixed(3)}ms`
)
