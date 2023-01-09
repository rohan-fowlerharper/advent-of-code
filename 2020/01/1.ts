import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

performance.mark('start')

const lines = input.trimEnd().split('\n').map(Number)

performance.mark('parsed')

for (let i = 0; i < lines.length; i++) {
  for (let j = i + 1; j < lines.length; j++) {
    if (lines[i] + lines[j] === 2020) {
      performance.mark('end')
      console.log(lines[i] * lines[j])
    }
  }
}

console.log(
  `To parse: ${performance
    .measure('01.1', 'start', 'parsed')
    .duration.toFixed(3)}ms`
)

console.log(
  `To solve: ${performance
    .measure('01.1', 'parsed', 'end')
    .duration.toFixed(3)}ms`
)
